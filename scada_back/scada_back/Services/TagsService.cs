using System;
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
    }
}

