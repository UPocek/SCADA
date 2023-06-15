using System;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using scada_back.DTOs;
using scada_back.Hubs;
using scada_back.Hubs.Clients;
using scada_back.Models;

namespace scada_back.Services
{
    public class TagsService
    {
        private MongoDBService _mongo;
        private readonly IHubContext<TagsHub, ITagsClient> _tagsHub;
        public TagsService(MongoDBService mongoDB, IHubContext<TagsHub, ITagsClient> tagsHub)
        {
            _mongo = mongoDB;
            _tagsHub = tagsHub;
        }

        public async Task<List<AddressValueAnalog>> GetAllAnalogAddressesAsync()
        {
            return await _mongo._addressValueAnalogCollection.Find(_ => true).ToListAsync();

        }

        public async Task<List<AddressValueDigital>> GetAllDigitalAddressesAsync()
        {
            return await _mongo._addressValueDigitalCollection.Find(_ => true).ToListAsync();
        }

        public async Task UpdateDigitalTag(string address, int value)
        {
            var updateTag = Builders<AddressValueDigital>.Update.Set("Value", value);
            await _mongo._addressValueDigitalCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
        }

        public async Task UpdateAnalogTag(string address, double value)
        {
            var updateTag = Builders<AddressValueAnalog>.Update.Set("Value", value);
            await _mongo._addressValueAnalogCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
        }

        public void RunUserThreads(User user)
        {
            foreach (AnalogInput analogInput in user.AnalogInputs)
            {
                StartAnalogTagThread(analogInput, user);
            }
            foreach (DigitalInput digitalInput in user.DigitalInputs)
            {
                StartDigitalTagThread(digitalInput, user);
            }
        }

        private void StartAnalogTagThread(AnalogInput analogInput, User user)
        {
            new Thread(async () =>
            {
                Thread.CurrentThread.IsBackground = true;

                while (await IsUserActive(user))
                {
                    if (await IsAnalogInputActive(analogInput, user))
                    {
                        var tag = await _mongo._addressValueAnalogCollection.Find(item => item.Address == analogInput.IOAddress).SingleOrDefaultAsync();
                        sendTagMessage(new TagMessageDTO(user.Id, analogInput.Id, CapValue(analogInput.LowLimit, analogInput.HighLimit, tag.Value)));
                    }

                    Thread.Sleep(analogInput.ScanTime);
                }
                SaveLastAnalogValue(analogInput, user);

            }).Start();
        }

        private void StartDigitalTagThread(DigitalInput digitalInput, User user)
        {
            new Thread(async () =>
            {
                Thread.CurrentThread.IsBackground = true;

                while (await IsUserActive(user))
                {
                    if (await IsDigitalInputActive(digitalInput, user))
                    {
                        var tag = await _mongo._addressValueDigitalCollection.Find(item => item.Address == digitalInput.IOAddress).SingleOrDefaultAsync();
                        sendTagMessage(new TagMessageDTO(user.Id, digitalInput.Id, tag.Value));
                    }

                    Thread.Sleep(digitalInput.ScanTime);
                }
                SaveLastDigitalValue(digitalInput, user);

            }).Start();
        }

        private async Task<bool> IsUserActive(User user)
        {
            return (await _mongo._userCollection.Find(item => item.Id == user.Id).SingleOrDefaultAsync())?.Active ?? false;
        }

        private async Task<bool> IsAnalogInputActive(AnalogInput analogInput, User user)
        {
            return (await _mongo._userCollection.Find(item => item.Id == user.Id).SingleOrDefaultAsync())?.AnalogInputs.Where(input => input.Id == analogInput.Id).SingleOrDefault()?.OnOffScan ?? false;
        }

        private async Task<bool> IsDigitalInputActive(DigitalInput digitalInput, User user)
        {
            return (await _mongo._userCollection.Find(item => item.Id == user.Id).SingleOrDefaultAsync())?.DigitalInputs.Where(input => input.Id == digitalInput.Id).SingleOrDefault()?.OnOffScan ?? false;
        }

        private double CapValue(double min, double max, double value)
        {
            return Math.Min(Math.Max(min, value), max);
        }

        private async void sendTagMessage(TagMessageDTO message)
        {
            await _tagsHub.Clients.All.ReceiveMessage(message);
        }

        private async void SaveLastAnalogValue(AnalogInput analogInput, User user)
        {
            var tag = await _mongo._addressValueAnalogCollection.Find(item => item.Address == analogInput.IOAddress).SingleOrDefaultAsync();
            user.AnalogInputs.Where(input => input.Id == analogInput.Id).Single().Value = tag.Value;
            await _mongo._userCollection.ReplaceOneAsync(item => item.Id == user.Id, user);
        }

        private async void SaveLastDigitalValue(DigitalInput digitalInput, User user)
        {
            var tag = await _mongo._addressValueDigitalCollection.Find(item => item.Address == digitalInput.IOAddress).SingleOrDefaultAsync();
            user.DigitalInputs.Where(input => input.Id == digitalInput.Id).Single().Value = tag.Value;
            await _mongo._userCollection.ReplaceOneAsync(item => item.Id == user.Id, user);
        }
    }
}

