using System;
namespace scada_back.DTOs
{
    public class AlarmDTO
    {
        public string Direction { get; set; }
        public double Value { get; set; }
        public int Priority { get; set; }

        public AlarmDTO(string direction, double value, int priority)
        {
            Direction = direction;
            Value = value;
            Priority = priority;
        }

        public AlarmDTO()
        {
        }
    }
}

