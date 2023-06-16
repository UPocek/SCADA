using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class HistoryInstance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Address { get; set; }
        public double Value { get; set; }
        public DateTime Date { get; set; }

        public HistoryInstance(string address, double value, DateTime date)
        {
            Address = address;
            Value = value;
            Date = date;
        }

        public HistoryInstance(string id, string address, double value, DateTime date)
        {
            Id = id;
            Address = address;
            Value = value;
            Date = date;
        }

        public HistoryInstance()
        {
        }
    }
}

