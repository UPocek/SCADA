using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class Alarm
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }
        public String Direction { get; set; }
        public Double Value { get; set; }
        public int Priority { get; set; }

        public Alarm()
        {
        }
    }
}

