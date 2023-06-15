using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class AddressValueDigital
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Address { get; set; }
        public int Value { get; set; }
        public double ScanTime { get; set; }
        public string RTUId { get; set; }
        public string Name { get; set; }

        public AddressValueDigital(int value, double scanTime, string rtu, string name)
        {
            Value = value;
            ScanTime = scanTime;
            RTUId = rtu;
            Name = name;
        }

        public AddressValueDigital()
        {
        }
    }
}

