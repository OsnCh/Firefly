using Firefly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Firefly.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public String GetDataFirstTest(double Width,double Height)
        {
            return new JavaScriptSerializer().
                Serialize(FirstTestModel.getListResult(Width, Height));
        }
    }
}