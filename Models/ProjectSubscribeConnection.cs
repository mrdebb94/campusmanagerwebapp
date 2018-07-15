using EvoManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace evomanager_next.Models
{
    public class ProjectSubscribeConnection
    {
        public string ProjectSubscribeConnectionId { get; set; }
        public string ProjectLeaderId { get; set; }
        public string ConnectionId { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
    }
}
