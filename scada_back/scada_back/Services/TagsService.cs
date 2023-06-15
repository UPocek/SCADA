using System;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using scada_back.Models;

namespace scada_back.Services
{
    public class TagsService
    {
        private MongoDBService _mongo;
        public TagsService(MongoDBService mongoDB)
        {
            _mongo = mongoDB;
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
    }
}

