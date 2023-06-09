﻿using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.Models
{
    public class AddressValueAnalog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Address { get; set; }
        public double Value { get; set; }
        public double LowLimit { get; set; }
        public double HighLimit { get; set; }
        public string Units { get; set; }
        public double ScanTime { get; set; }
        public string RTUId { get; set; }
        public string Name { get; set; }
        public bool OnOffScan { get; set; }

        public AddressValueAnalog(double value, double lowLimit, double highLimit, string units, double scanTime, string rtu, string name, bool onOffScan)
        {
            Value = value;
            LowLimit = lowLimit;
            HighLimit = highLimit;
            Units = units;
            ScanTime = scanTime;
            RTUId = rtu;
            Name = name;
            OnOffScan = onOffScan;
        }

        public AddressValueAnalog()
        {
        }
    }
}

