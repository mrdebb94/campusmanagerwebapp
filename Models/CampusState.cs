using System;

namespace EvoManager.Models
{
    public enum CampusStateValue {
        CAMPUS_INACTIVE=0,
        CAMPUS_ACTIVE_NOT_STARTED=1,
        CAMPUS_ACTIVE_STARTED=2,
        CAMPUS_FINISHED=3
    }

    public class CampusState 
    {
        public string CampusStateId { get;set;}

        public int CampusStateValue { get; set; }

        public string CampusId { get; set; }
        public virtual Campus Campus { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

}