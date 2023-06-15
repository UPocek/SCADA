﻿using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public ICollection<AnalogInput> AnalogInputs { get; set; }
        public ICollection<DigitalInput> DigitalInputs { get; set; }

        public User(string username, string password, bool isAdmin, ICollection<AnalogInput> analogInputs, ICollection<DigitalInput> digitalInputs)
        {
            Username = username;
            Password = password;
            IsAdmin = isAdmin;
            AnalogInputs = analogInputs;
            DigitalInputs = digitalInputs;
        }

        public User()
        {
        }
    }
}
