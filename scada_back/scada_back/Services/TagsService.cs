using System;
using System.Net;
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
        private readonly IHubContext<AlarmsHub, IAlarmsClient> _alarmsHub;
        public TagsService(MongoDBService mongoDB, IHubContext<TagsHub, ITagsClient> tagsHub, IHubContext<AlarmsHub, IAlarmsClient> alarmsHub)
        {
            _mongo = mongoDB;
            _tagsHub = tagsHub;
            _alarmsHub = alarmsHub;
        }

        public async Task<List<AddressValueAnalog>> GetAllAnalogAddressesAsync()
        {
            return await _mongo._addressValueAnalogCollection.Find(_ => true).ToListAsync();

        }

        public async Task<List<AddressValueDigital>> GetAllDigitalAddressesAsync()
        {
            return await _mongo._addressValueDigitalCollection.Find(_ => true).ToListAsync();
        }

        public async Task TurnSwitchDigitalTag(string address)
        {
            var tag = await _mongo._addressValueDigitalCollection.Find(item => item.Address == address).SingleOrDefaultAsync();
            var updateTag = Builders<AddressValueDigital>.Update.Set("OnOffScan", !tag.OnOffScan);
            await _mongo._addressValueDigitalCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
        }

        public async Task TurnSwitchAnalogTag(string address)
        {
            var tag = await _mongo._addressValueAnalogCollection.Find(item => item.Address == address).SingleOrDefaultAsync();
            var updateTag = Builders<AddressValueAnalog>.Update.Set("OnOffScan", !tag.OnOffScan);
            await _mongo._addressValueAnalogCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
        }

        public async Task UpdateDigitalTag(string address, int value)
        {
            var updateTag = Builders<AddressValueDigital>.Update.Set("Value", value);
            await _mongo._addressValueDigitalCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
            SaveCurrentValueForHistory(address, value);
        }

        public async Task UpdateAnalogTag(string address, double value)
        {
            var updateTag = Builders<AddressValueAnalog>.Update.Set("Value", value);
            await _mongo._addressValueAnalogCollection.UpdateOneAsync(tag => tag.Address == address, updateTag);
            SaveCurrentValueForHistory(address, value);
        }

        public void RunUserThreads(User user)
        {
            foreach (var analogInput in user.AnalogInputs)
            {
                StartAnalogTagThread(analogInput, user);
            }
            foreach (var digitalInput in user.DigitalInputs)
            {
                StartDigitalTagThread(digitalInput, user);
            }
        }

        private void StartAnalogTagThread(AnalogInput? analogInput, User user)
        {
            new Thread(async () =>
            {
                Thread.CurrentThread.IsBackground = true;

                while (true)
                {
                    user = await _mongo._userCollection.Find(item => item.Id == user.Id).SingleOrDefaultAsync();
                    if (user is null || !user.Active)
                    {
                        try
                        {
                            SaveLastAnalogValue(analogInput, user);
                        }
                        catch { }
                        break;
                    }
                    analogInput = user.AnalogInputs.Where(input => input.Id == analogInput.Id).SingleOrDefault();
                    if (analogInput is null)
                    {
                        break;
                    }
                    if (analogInput.OnOffScan)
                    {
                        AddressValueAnalog tag = await _mongo._addressValueAnalogCollection.Find(item => item.Address == analogInput.IOAddress).SingleOrDefaultAsync();
                        if (tag is null) { break; }
                        NotifyAnalogAlarms(user, tag, (List<Alarm>)analogInput.Alarms, analogInput);
                        SendTagMessage(new TagMessageDTO(user.Id, analogInput.Id, CapValue(analogInput.LowLimit, analogInput.HighLimit, tag.Value)));
                        SaveCurrentAnalogTagValue(analogInput, tag);
                    }

                    Thread.Sleep(analogInput.ScanTime);
                }

            }).Start();
        }

        private async void SaveCurrentValueForHistory(string address, double value)
        {
            await _mongo._historyCollection.InsertOneAsync(new HistoryInstance(address, value, DateTime.Now));
        }

        private void StartDigitalTagThread(DigitalInput? digitalInput, User user)
        {
            new Thread(async () =>
            {
                Thread.CurrentThread.IsBackground = true;

                while (true)
                {
                    user = await _mongo._userCollection.Find(item => item.Id == user.Id).SingleOrDefaultAsync();
                    if (user is null || !user.Active)
                    {
                        try
                        {
                            SaveLastDigitalValue(digitalInput, user);
                        }
                        catch { }
                        break;
                    }

                    digitalInput = user.DigitalInputs.Where(input => input.Id == digitalInput.Id).SingleOrDefault();
                    if (digitalInput is null)
                    {
                        break;
                    }

                    if (digitalInput.OnOffScan)
                    {
                        AddressValueDigital tag = await _mongo._addressValueDigitalCollection.Find(item => item.Address == digitalInput.IOAddress).SingleOrDefaultAsync();
                        if (tag is null) { break; }
                        SendTagMessage(new TagMessageDTO(user.Id, digitalInput.Id, tag.Value));
                        SaveCurrentDigitalTagValue(digitalInput, tag);
                    }

                    Thread.Sleep(digitalInput.ScanTime);
                }

            }).Start();
        }

        private void NotifyAnalogAlarms(User user, AddressValueAnalog tag, List<Alarm> alarms, AnalogInput analogInput)
        {
            foreach (var alarm in alarms)
            {
                if (alarm.Direction == "notify_if_greater" && tag.Value > alarm.Value)
                {
                    SendAlarmMessage(new AlarmMessageDTO(user.Id, tag.Address, $"{analogInput.Description} has exceeded {alarm.Value}{tag.Units}", alarm.Priority));
                    WriteLog($"{tag.Address} - {analogInput.Description} has exceeded {alarm.Value}{tag.Units}");
                    SaveAlarm(tag, alarm, analogInput);
                }
                else if (alarm.Direction == "notify_if_lower" && tag.Value < alarm.Value)
                {
                    SendAlarmMessage(new AlarmMessageDTO(user.Id, tag.Address, $"{analogInput.Description} is below {alarm.Value}{tag.Units}", alarm.Priority));
                    WriteLog($"{tag.Address} - {analogInput.Description} is below {alarm.Value}{tag.Units}");
                    SaveAlarm(tag, alarm, analogInput);
                }
            }
        }

        private static double CapValue(double min, double max, double value)
        {
            return Math.Min(Math.Max(min, value), max);
        }

        private async void SendTagMessage(TagMessageDTO message)
        {
            await _tagsHub.Clients.All.ReceiveMessage(message);
        }

        private async void SendAlarmMessage(AlarmMessageDTO message)
        {
            await _alarmsHub.Clients.All.ReceiveMessage(message);
        }

        private static void WriteLog(string message)
        {
            string logFileName = @"scada.log";

            using (StreamWriter sw = File.AppendText(logFileName))
            {
                sw.WriteLine(message);
            }

        }

        private async void SaveAlarm(AddressValueAnalog tag, Alarm alarm, AnalogInput analogInput)
        {
            await _mongo._alarmCollection.InsertOneAsync(new AlarmInstance(DateTime.Now, alarm.Direction, alarm.Value, alarm.Priority, analogInput.Id, analogInput.IOAddress, tag.Units));
        }

        private async void SaveCurrentAnalogTagValue(AnalogInput input, AddressValueAnalog tag)
        {
            await _mongo._tagvalueCollection.InsertOneAsync(new TagValueInstance(input.Id, input.Description, tag.Value, tag.Units, tag.Address));
        }

        private async void SaveCurrentDigitalTagValue(DigitalInput input, AddressValueDigital tag)
        {
            await _mongo._tagvalueCollection.InsertOneAsync(new TagValueInstance(input.Id, input.Description, tag.Value, "on/off", tag.Address));
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

        public async Task ControlTag(string address, double value, string type)
        {
            if (type == "analog")
            {
                var control = Builders<ControlAnalog>.Update.Set("Value", value);
                await _mongo._controlAnalogCollection.UpdateOneAsync(item => item.Address == address, control);
            }
            else if (type == "digital")
            {
                var control = Builders<ControlDigital>.Update.Set("Value", (int)value);
                await _mongo._controlDigitalCollection.UpdateOneAsync(item => item.Address == address, control);
            }
            else
            {
                throw new Exception("Invalid type");
            }
        }

        public async Task<List<ControlValuesDTO>> GetAllControlValues()
        {
            List<ControlValuesDTO> controlValues = new List<ControlValuesDTO>();
            foreach (var control in await _mongo._controlAnalogCollection.Find(_ => true).ToListAsync())
            {
                controlValues.Add(new ControlValuesDTO(control.Address, control.Value));
            }
            foreach (var control in await _mongo._controlDigitalCollection.Find(_ => true).ToListAsync())
            {
                controlValues.Add(new ControlValuesDTO(control.Address, control.Value));
            }
            return controlValues;
        }
    }
}

