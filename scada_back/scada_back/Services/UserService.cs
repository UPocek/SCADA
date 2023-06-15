using scada_back.DTOs;
using scada_back.Models;
using MongoDB.Driver;
using System.Security.Cryptography;

using System;
using System.Text;

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

        public async Task DeactivateUser(string userId)
        {
            var update = Builders<User>.Update.Set(user => user.Active, false);
            await _mongo._userCollection.UpdateOneAsync(user => user.Id == userId, update);
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

