using System;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using scada_back.Models;

namespace scada_back.Services
{
    public class MongoDBService
    {
        public readonly IMongoCollection<AnalogInput> _analogInputsCollection;

        public MongoDBService(
            IOptions<ScadaDatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(
                databaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                databaseSettings.Value.DatabaseName);

            _analogInputsCollection = mongoDatabase.GetCollection<AnalogInput>(
                databaseSettings.Value.AnalogInputCollectionName);
        }
    }
}

