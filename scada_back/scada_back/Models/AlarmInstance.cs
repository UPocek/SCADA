using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class AlarmInstance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Date { get; set; }
        public string Direction { get; set; }
        public double Value { get; set; }
        public int Priority { get; set; }
        public string TagId { get; set; }
        public string Address { get; set; }
        public string Units { get; set; }

        public AlarmInstance(DateTime date, string direction, double value, int priority, string tagId, string address, string units)
        {
            Date = date;
            Direction = direction;
            Value = value;
            Priority = priority;
            TagId = tagId;
            Address = address;
            Units = units;
        }

        public AlarmInstance(string? id, DateTime date, string direction, double value, int priority, string tagId, string address, string units)
        {
            Id = id;
            Date = date;
            Direction = direction;
            Value = value;
            Priority = priority;
            TagId = tagId;
            Address = address;
            Units = units;
        }

        public AlarmInstance()
        {
        }
    }
}

