using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace scada_back.DTOs
{
    public class ControlValuesDTO
    {

        public string Address { get; set; }
        public double Value { get; set; }

        public ControlValuesDTO(string address, double value)
        {
            Address = address;
            Value = value;
        }

        public ControlValuesDTO()
        {
        }
    }
}

