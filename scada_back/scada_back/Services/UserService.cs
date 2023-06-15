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
            userCredentials.Password = EncriptPassword(userCredentials.Password);
            var userToInsert = new User(userCredentials);
            await _mongo._userCollection.InsertOneAsync(userToInsert);
            return await _mongo._userCollection.Find(item => item.Username == userToInsert.Username).SingleAsync();
        }

        public async Task<User> GetUser(UserCredentialsDTO userCredentials)
        {
            return await _mongo._userCollection.Find(item => item.Username == userCredentials.Username && item.Password == EncriptPassword(userCredentials.Password)).SingleOrDefaultAsync();
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

