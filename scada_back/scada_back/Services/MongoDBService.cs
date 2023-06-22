using System;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using scada_back.Models;

namespace scada_back.Services
{
    public class MongoDBService
    {
        public readonly IMongoCollection<AddressValueAnalog> _addressValueAnalogCollection;
        public readonly IMongoCollection<AddressValueDigital> _addressValueDigitalCollection;
        public readonly IMongoCollection<User> _userCollection;
        public readonly IMongoCollection<AlarmInstance> _alarmCollection;
        public readonly IMongoCollection<TagValueInstance> _tagvalueCollection;
        public readonly IMongoCollection<HistoryInstance> _historyCollection;
        public readonly IMongoCollection<ControlAnalog> _controlAnalogCollection;
        public readonly IMongoCollection<ControlDigital> _controlDigitalCollection;

        public MongoDBService(
            IOptions<ScadaDatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(
                databaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                databaseSettings.Value.DatabaseName);

            _addressValueAnalogCollection = mongoDatabase.GetCollection<AddressValueAnalog>(
                databaseSettings.Value.AddressValueAnalogCollectionName);
            _addressValueDigitalCollection = mongoDatabase.GetCollection<AddressValueDigital>(
                databaseSettings.Value.AddressValueDigitalCollectionName);
            _userCollection = mongoDatabase.GetCollection<User>(
                databaseSettings.Value.UserCollectionName);
            _alarmCollection = mongoDatabase.GetCollection<AlarmInstance>(
                databaseSettings.Value.AlarmCollectionName);
            _tagvalueCollection = mongoDatabase.GetCollection<TagValueInstance>(
                databaseSettings.Value.TagValueCollectionName);
            _historyCollection = mongoDatabase.GetCollection<HistoryInstance>(
                databaseSettings.Value.HistoryCollectionName);
            _controlAnalogCollection = mongoDatabase.GetCollection<ControlAnalog>(
                databaseSettings.Value.ControlAnalogCollectionName);
            _controlDigitalCollection = mongoDatabase.GetCollection<ControlDigital>(
                databaseSettings.Value.ControlDigitalCollectionName);

            InitializeDB();
        }

        private void InitializeDB()
        {
            if (!_addressValueAnalogCollection.Find(_ => true).Any())
            {
                ICollection<AddressValueAnalog> addressValueAnalogs = new List<AddressValueAnalog>() {
                new AddressValueAnalog(0.0, -50.0, 50.0, "C", 1000.0, "1", "Temperature"),
                new AddressValueAnalog(82.0, 0.0, 100.0, "% humidity", 1000.0, "2", "Humidity"),
                new AddressValueAnalog(24.0, 0.0, 999.0, "C", 500.0, "1", "Temperature"),
                new AddressValueAnalog(50.0, 0.0, 100.0, "% open", 2000.0, "2", "Valve"),
                new AddressValueAnalog(1013.0, 1000.0, 1100.0, "mb", 1500.0, "1", "Pressure")};
                _addressValueAnalogCollection.InsertMany(addressValueAnalogs);
            }
            if (!_addressValueDigitalCollection.Find(_ => true).Any())
            {
                ICollection<AddressValueDigital> addressValueDigitals = new List<AddressValueDigital>() {
                new AddressValueDigital(0, 1000.0, "1", "Main Pump"),
                new AddressValueDigital(1, 1000.0, "2", "Main Pump"),
                new AddressValueDigital(0, 500.0, "1", "Filter 1"),
                new AddressValueDigital(0, 2000.0, "2", "Filter 1"),
                new AddressValueDigital(0, 1500.0, "1", "Second Pump")};
                _addressValueDigitalCollection.InsertMany(addressValueDigitals);
            }
            if (!_userCollection.Find(user => user.IsAdmin).Any())
            {
                _userCollection.InsertOne(new User("admin", "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", "Admin", "Admin", true, new List<AnalogInput>(), new List<DigitalInput>(), false));
            }
            if (!_controlAnalogCollection.Find(_ => true).Any())
            {
                List<ControlAnalog> controlAddresses = new List<ControlAnalog>();
                List<AddressValueAnalog> analogInputs = _addressValueAnalogCollection.Find(_ => true).ToList();
                foreach (var ai in analogInputs)
                {
                    controlAddresses.Add(new ControlAnalog(ai.Address, ai.Value));
                }
                _controlAnalogCollection.InsertMany(controlAddresses);
            }
            if (!_controlDigitalCollection.Find(_ => true).Any())
            {
                List<ControlDigital> controlAddresses = new List<ControlDigital>();
                List<AddressValueDigital> digitalInputs = _addressValueDigitalCollection.Find(_ => true).ToList();
                foreach (var di in digitalInputs)
                {
                    controlAddresses.Add(new ControlDigital(di.Address, di.Value));
                }
                _controlDigitalCollection.InsertMany(controlAddresses);
            }
        }
    }
}

