using Firefly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Firefly.Controllers
{
    public class ConceptSearchController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public String GetData(String startModel)
        {
            FireflyModel model = new 
                FireflyModel(new JavaScriptSerializer().Deserialize<FireflyStartModel>(startModel));
            model.SetPositionFirefly();
            return new JavaScriptSerializer().
                Serialize(model.GetGeneration());
        }
    }
}