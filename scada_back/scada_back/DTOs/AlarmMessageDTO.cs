using System;
namespace scada_back.DTOs
{
    public class AlarmMessageDTO
    {

        public string User { get; set; }
        public string Address { get; set; }
        public string Message { get; set; }
        public int Priority { get; set; }

        public AlarmMessageDTO(string user, string address, string message, int priority)
        {
            User = user;
            Address = address;
            Message = message;
            Priority = priority;
        }

        public AlarmMessageDTO()
        {
        }
    }
}

