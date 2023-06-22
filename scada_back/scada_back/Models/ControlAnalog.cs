using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class ControlAnalog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Address { get; set; }
        public double Value { get; set; }

        public ControlAnalog(string? address, double value)
        {
            Address = address;
            Value = value;
        }

        public ControlAnalog()
        {
        }
    }
}

