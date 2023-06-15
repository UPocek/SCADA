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
            userCredentials.Password = EncriptPassword(userCredentials.Password);
            var userToInsert = new User(userCredentials);
            await _mongo._userCollection.InsertOneAsync(userToInsert);
            return await _mongo._userCollection.Find(item => item.Username == userToInsert.Username).SingleAsync();
        }

        public async Task<User> GetUser(UserCredentialsDTO userCredentials)
        {
            return await _mongo._userCollection.Find(item => item.Username == userCredentials.Username && item.Password == EncriptPassword(userCredentials.Password)).SingleOrDefaultAsync();
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

