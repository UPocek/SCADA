using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using scada_back.DTOs;

namespace scada_back.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public bool IsAdmin { get; set; }
        public ICollection<AnalogInput> AnalogInputs { get; set; }
        public ICollection<DigitalInput> DigitalInputs { get; set; }
        public bool Active { get; set; }

        public User(string username, string password, string name, string surname, bool isAdmin, ICollection<AnalogInput> analogInputs, ICollection<DigitalInput> digitalInputs, bool active)
        {
            Username = username;
            Password = password;
            Name = name;
            Surname = surname;
            IsAdmin = isAdmin;
            AnalogInputs = analogInputs;
            DigitalInputs = digitalInputs;
            Active = active;
        }

        public User(UserCredentialsDTO userCredentials)
        {
            Username = userCredentials.Username;
            Password = userCredentials.Password;
            Name = userCredentials.Name;
            Surname = userCredentials.Surname;
            IsAdmin = false;
            AnalogInputs = new List<AnalogInput>();
            DigitalInputs = new List<DigitalInput>();
            Active = false;
        }

        public User()
        {
        }
    }
}

