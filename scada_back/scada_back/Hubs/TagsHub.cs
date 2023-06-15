using System;
using System.Threading.Tasks;
using scada_back.Models;
using Microsoft.AspNetCore.SignalR;
using scada_back.DTOs;
using scada_back.Hubs.Clients;

namespace scada_back.Hubs
{
    public class TagsHub : Hub<ITagsClient>
    {
        public TagsHub()
        {
        }

        public async Task SendMessage(TagMessageDTO message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
}

