using System;

namespace EvoManager.ViewModels
{
   public class CampusViewModel 
   {
       public string CampusId { get; set; }
       public DateTime StartDate { get; set; }
       public DateTime EndDate { get; set; }
       public DateRange CampusInactive { get; set; }
       public DateRange CampusActiveNotStarted { get; set; }
       public DateRange CampusActiveStarted { get; set; }
       public DateRange CampusFinished { get; set; }
   }

}