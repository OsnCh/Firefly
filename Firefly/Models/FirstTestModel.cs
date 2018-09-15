using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace Firefly.Models
{
    public class FirstTestModel
    {
        public static List<FireflyPointForFirstTest> getListResult(double Width,double Height)
        {
            Random random = new Random();

            int XF = random.Next(0, 2);
            if (XF == 0) XF = -1;
            Thread.Sleep(500);
            int YF = random.Next(0, 2);
            if (YF == 0) YF = -1;

            List<PointFirefly> listPoint = new List<PointFirefly>();
            listPoint.Add(new PointFirefly(Width / 2 * XF, Height / 2 * YF));
            listPoint.Add(new PointFirefly((Width / 2 - Width/4) * XF, 
                (Height / 2) * YF));
            listPoint.Add(new PointFirefly((Width / 2) * XF,
                (Height / 2+Height/4) * YF));
            listPoint.Add(new PointFirefly((Width / 2 + Width / 4) * XF,
                (Height / 2) * YF));
            listPoint.Add(new PointFirefly((Width / 2) * XF,
                (Height / 2 - Height / 4) * YF));

            List<FireflyPointForFirstTest> listResult = new List<FireflyPointForFirstTest>();

            for (int i = 0; i < listPoint.Count; i++)
            {
                listResult.Add(new FireflyPointForFirstTest(listPoint[i], random.NextDouble() * 10 - 5,
                    false, "t" + i));
                if (i == listPoint.Count - 1) break;
                Thread.Sleep(500);
            }

            int indexTrue = 0;
            for (int i = 0; i < listResult.Count; i++)
                if (listResult[i].Answer < listResult[indexTrue].Answer)
                    indexTrue = i;

            listResult[indexTrue].Right = true;

            return listResult;
        }
    }

    public class FireflyPointForFirstTest : FireflyAnswer
    {
        public bool Right { get; set; }
        public String Name { get; set; }

        public FireflyPointForFirstTest(PointFirefly point, double Answer, 
            bool Right, String Name) 
            : base(point, Answer)
        {
            this.Name = Name;
            this.Right = Right;
        }
    }
}