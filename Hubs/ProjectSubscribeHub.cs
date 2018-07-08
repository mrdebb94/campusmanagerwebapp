using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace evomanager_next.Hubs
{
    [Authorize]
    public class ProjectSubscribeHub:Hub
    {
        private readonly UserManager<EvoManager.Models.User> _userManager;

        public ProjectSubscribeHub(UserManager<EvoManager.Models.User> userManager) :base()
        {
            _userManager = userManager;
        }

        public async Task SubscribeProject(string message)
        {
           
                //var user = await _userManager.GetUserAsync(Context.User);
                await Clients.All.SendAsync("ProjectSubscribeChange", Context.User.Identity.Name, message);
            
        }
    }
}
