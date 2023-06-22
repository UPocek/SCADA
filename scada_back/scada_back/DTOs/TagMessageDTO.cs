using System;
namespace scada_back.DTOs
{
    public class TagMessageDTO
    {
        public string User { get; set; }
        public string Tag { get; set; }
        public double Value { get; set; }

        public TagMessageDTO(string user, string tag, double value)
        {
            User = user;
            Tag = tag;
            Value = value;
        }

        public TagMessageDTO()
        {
        }
    }
}

