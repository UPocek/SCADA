using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class ControlDigital
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Address { get; set; }
        public int Value { get; set; }

        public ControlDigital(string? address, int value)
        {
            Address = address;
            Value = value;
        }

        public ControlDigital()
        {
        }
    }
}

