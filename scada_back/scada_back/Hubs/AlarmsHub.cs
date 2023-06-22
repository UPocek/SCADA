using System;
using scada_back.DTOs;
using System.Threading.Tasks;
using scada_back.Models;
using Microsoft.AspNetCore.SignalR;
using scada_back.Hubs.Clients;

namespace scada_back.Hubs
{
    public class AlarmsHub : Hub<IAlarmsClient>
    {
        public AlarmsHub()
        {
        }

        public async Task SendMessage(AlarmMessageDTO message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
}

