using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class AnalogInput : Tag
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String? Id { get; set; }
        [BsonElement("Description")]
        public String Description { get; set; }
        public String IOAddress { get; set; }
        public Double ScanTime { get; set; }
        public ICollection<Alarm> Alarms { get; } = new List<Alarm>();

        public AnalogInput()
        {
        }
    }
}

