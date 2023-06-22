using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class TagValueInstance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string TagId { get; set; }
        public string Description { get; set; }
        public double Value { get; set; }
        public string Units { get; set; }
        public string Address { get; set; }

        public TagValueInstance(string tagId, string description, double value, string units, string address)
        {
            TagId = tagId;
            Description = description;
            Value = value;
            Units = units;
            Address = address;
        }

        public TagValueInstance(string? id, string tagId, string description, double value, string units, string address)
        {
            Id = id;
            TagId = tagId;
            Description = description;
            Value = value;
            Units = units;
            Address = address;
        }

        public TagValueInstance()
        {
        }
    }
}

