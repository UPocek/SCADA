using System;
namespace scada_back.DTOs
{
    public class DateRangeRequestDTO
    {

        public string From { get; set; }
        public string To { get; set; }

        public DateRangeRequestDTO(string from, string to)
        {
            From = from;
            To = to;
        }

        public DateRangeRequestDTO()
        {
        }
    }
}

