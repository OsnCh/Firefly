using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Firefly.Models
{
    public class ConceptSearchResponse
    {
        public List<PointFirefly> startGeneration { get; set; }
        public List<List<PointFirefly>> listGeneration { get; set; }

        public List<Redirect> FirstIndexRedirect { get; set; }

        public FireflyAnswer Answer { get; set; }

        public ConceptSearchResponse(List<PointFirefly> startGeneration,
            List<List<PointFirefly>> listGeneration,
            List<Redirect> FirstIndexRedirect, FireflyAnswer Answer)
        {
            this.startGeneration = startGeneration;
            this.listGeneration = listGeneration;
            this.FirstIndexRedirect = FirstIndexRedirect;
            this.Answer = Answer;
        }
    }

    public class Redirect
    {
        public int IndexFirst { get; set; }
        public int IndexLast { get; set; } 
    }
}