using scada_back.DTOs;
using scada_back.Models;
using MongoDB.Driver;
using System.Security.Cryptography;

using System;
using System.Text;
using System.Net;

namespace scada_back.Services
{
    public class UserService
    {
        private MongoDBService _mongo;
        public UserService(MongoDBService mongoDB)
        {
            _mongo = mongoDB;
        }

        public async Task<User> SaveUser(UserCredentialsDTO userCredentials)
        {
            if (await _mongo._userCollection.Find(user => user.Username == userCredentials.Username).AnyAsync())
            {
                throw new Exception("User with that username already exists");
            }
            userCredentials.Password = EncriptPassword(userCredentials.Password);
            var userToInsert = new User(userCredentials);
            await _mongo._userCollection.InsertOneAsync(userToInsert);
            return userToInsert;
        }

        public async Task<User> GetUser(UserCredentialsDTO userCredentials)
        {
            var update = Builders<User>.Update.Set(user => user.Active, true);
            var options = new FindOneAndUpdateOptions<User> { ReturnDocument = ReturnDocument.After };
            User user = await _mongo._userCollection.FindOneAndUpdateAsync<User>(item => item.Username == userCredentials.Username && item.Password == EncriptPassword(userCredentials.Password), update, options);
            return user;
        }

        public async Task<AnalogInput> AddNewAnalogTag(AnalogTagDTO newTag, string userId)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var analogInputs = user.AnalogInputs;

            AddressValueAnalog addressValueAnalog = await _mongo._addressValueAnalogCollection.Find(item => item.Address == newTag.IOAddress).SingleOrDefaultAsync();
            AnalogInput newAnalogInput = new AnalogInput(newTag, addressValueAnalog.Units, addressValueAnalog.Value);
            analogInputs.Add(newAnalogInput);
            var updateUser = Builders<User>.Update.Set("AnalogInputs", analogInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
            return newAnalogInput;
        }

        public async Task<DigitalInput> AddNewDigitalTag(DigitalTagDTO newTag, string userId)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var digitalInputs = user.DigitalInputs;

            AddressValueDigital addressValueDigital = await _mongo._addressValueDigitalCollection.Find(item => item.Address == newTag.IOAddress).SingleOrDefaultAsync();
            DigitalInput newDigitalInput = new DigitalInput(newTag, addressValueDigital.Value);
            digitalInputs.Add(newDigitalInput);
            var updateUser = Builders<User>.Update.Set("DigitalInputs", digitalInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
            return newDigitalInput;
        }

        public async Task ChangeAnalogScanOnOff(string userId, string ioAddress, bool answer)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var analogInputs = user.AnalogInputs;

            var changedTag = analogInputs.Single(ai => ai.IOAddress == ioAddress);
            changedTag.OnOffScan = answer;
            var updateUser = Builders<User>.Update.Set("AnalogInputs", analogInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
        }

        public async Task ChangeDigitalScanOnOff(string userId, string ioAddress, bool answer)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var digitalInputs = user.DigitalInputs;

            var changedTag = digitalInputs.Single(ai => ai.IOAddress == ioAddress);
            changedTag.OnOffScan = answer;
            var updateUser = Builders<User>.Update.Set("DigitalInputs", digitalInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
        }

        public async Task DeleteAnalogTag(string userId, string ioAddress)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var analogInputs = user.AnalogInputs;

            analogInputs = analogInputs.Where(ai => ai.IOAddress != ioAddress).ToList();

            var updateUser = Builders<User>.Update.Set("AnalogInputs", analogInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
        }

        public async Task DeleteDigitalTag(string userId, string ioAddress)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var digitalInputs = user.DigitalInputs;

            digitalInputs = digitalInputs.Where(ai => ai.IOAddress != ioAddress).ToList();
            var updateUser = Builders<User>.Update.Set("DigitalInputs", digitalInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
        }

        public async Task DeactivateUser(string userId)
        {
            var update = Builders<User>.Update.Set(user => user.Active, false);
            await _mongo._userCollection.UpdateOneAsync(user => user.Id == userId, update);
        }

        public async Task AddAlarm(string userId, string ioAddress, AlarmDTO alarm)
        {
            User user = await _mongo._userCollection.Find(item => item.Id == userId).SingleOrDefaultAsync();
            var analogInputs = user.AnalogInputs;

            analogInputs.Where(ai => ai.IOAddress == ioAddress).Single().Alarms.Add(new Alarm(alarm));

            var updateUser = Builders<User>.Update.Set("AnalogInputs", analogInputs);
            await _mongo._userCollection.UpdateOneAsync(u => u.Id == userId, updateUser);
        }

        private static string EncriptPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
