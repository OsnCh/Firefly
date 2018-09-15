using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading;
using System.Web;

namespace Firefly.Models
{
    public class FireflyModel:FireflyStartModel
    {
        public List<PointFirefly> startGeneration { get; }
        public List<List<PointFirefly>> listGeneration { get;}
        public Random random;

        public FireflyModel(FireflyStartModel start)
        {
            a = start.a;
            b = start.b;
            c = start.c;
            p = start.p;
            t = start.t;
            g = start.g;

            Width = start.Width;
            Height = start.Height;

            a0 = start.a0;
            b0 = start.b0;
            yota = start.yota;

            N = start.N;
            S = start.S;
            startGeneration = new List<PointFirefly>();
            listGeneration = new List<List<PointFirefly>>();
            random = new Random();
        }

        public void SetPositionFirefly()
        {
            double size = Math.Sqrt(Width * Height * 4 / S);
            for (int i = 1; i <= Height/size*2; i++)
                for (int j = 1; j <= Width/size*2; j++)
                    startGeneration.
                        Add(new PointFirefly(size * j - size/2 - Width
                        , size * i - size/2 - Height));
        }

        public ConceptSearchResponse GetGeneration()
        {
            if (startGeneration.Count == 0)
                SetPositionFirefly();

            if (listGeneration.Count == 0)
                listGeneration.Add(startGeneration);

            List<Redirect> redirects = new List<Redirect>();

            for(int i = 0; i < N; i++)
            {
                List<PointFirefly> Old = listGeneration.Last();
                List<PointFirefly> New = new List<PointFirefly>();
                int FirstShift = 0;
                for (int j = 0; j < Old.Count; j++)
                {
                    PointFirefly better = Old[j];
                    for(int k = 0; k < Old.Count; k++)
                    {
                        if (GetAttractiveness(Old[j], Old[k])
                            < GetAttractiveness(Old[j], better) && k!=j)
                        {
                            better = Old[k];
                            if (i == 0)
                                FirstShift = k;
                        }
                    }
                    if (better != Old[j])
                    {
                        PointFirefly buffer = Old[j];
                        better = Shift(buffer, better, N);
                    }

                    New.Add(better);
                    if (i == 0)
                        redirects.Add(new Redirect() { IndexFirst = j , IndexLast = FirstShift });
                }
                listGeneration.Add(New);

            }

            FireflyAnswer answer = new FireflyAnswer(listGeneration.Last().First(), 
                GetZ(listGeneration.Last().First()));
            for (int i = 1; i < listGeneration.Last().Count; i++)
                if (GetZ(listGeneration.Last()[i]) < answer.Answer)
                    answer = new FireflyAnswer(listGeneration.Last()[i], GetZ(listGeneration.Last()[i]));

            return new ConceptSearchResponse(startGeneration,
                listGeneration, redirects,answer);
        }

        private double GetAttractiveness(PointFirefly i,PointFirefly j)
        {
            double z = GetZ(j);
            double radius = Math.Sqrt(Math.Pow(i.X1 - j.X1, 2) + Math.Pow(i.X2 - j.X2, 2));

            return (b0 * z) / (1 + yota * Math.Pow(radius, 2));
        }

        private PointFirefly Shift(PointFirefly i, PointFirefly j, int n)
        {
            double radius = Math.Sqrt(Math.Pow(i.X1 - j.X1, 2) + Math.Pow(i.X2 - j.X2, 2));
            double Bij = b0 / (1 + yota * Math.Pow(radius, n));

            double X1 = j.X1 + Bij * (i.X1 - j.X1) + GetA(n) * (random.NextDouble() * 2 - 1);
            double X2 = j.X2 + Bij * (i.X2 - j.X2) + GetA(n) * (random.NextDouble() * 2 - 1);

            return new PointFirefly(X1,X2);
        }

        private double GetZ(PointFirefly j)
        {
            return a * Math.Pow(j.X1 + c, b) +
                p * Math.Pow(j.X2 + g, t);
        }

        private double GetA(int n)
        {
            double a = a0;
            for (int i = 0; i < n - 1; i++)
                a = a + (a0 - a) * Math.Pow(Math.E, -1);
            return a;
        }

    }

    public class PointFirefly : IEquatable<PointFirefly>
    {
        public PointFirefly(PointFirefly point)
        {
            X1 = point.X1;
            X2 = point.X2;
        }

        public PointFirefly(double X1,double X2)
        {
            this.X1 = X1;
            this.X2 = X2;
        }

        public double X1 { get; set; }
        public double X2 { get; set; }

        public static bool operator !=(PointFirefly first, PointFirefly second)
        {
            return !(first.X1 == second.X1 && first.X2 == second.X2);
        }

        public static bool operator == (PointFirefly first, PointFirefly second)
        {
            return first.X1 == second.X1 && first.X2 == second.X2;
        }

        public override bool Equals(object obj)
        {
            return Equals(obj as PointFirefly);
        }

        public bool Equals(PointFirefly other)
        {
            return other != null &&
                   X1 == other.X1 &&
                   X2 == other.X2;
        }

        public override int GetHashCode()
        {
            var hashCode = 1280913280;
            hashCode = hashCode * -1521134295 + X1.GetHashCode();
            hashCode = hashCode * -1521134295 + X2.GetHashCode();
            hashCode = hashCode * -1521134295;
            return hashCode;
        }
    }

    public class FireflyAnswer : PointFirefly
    {
        public double Answer { get; set; }

        public FireflyAnswer(double X1, double X2, double Answer) : base(X1, X2)
        {
            this.Answer = Answer;
        }

        public FireflyAnswer(PointFirefly point,double Answer) : base(point)
        {
            this.Answer = Answer;
        }

    }
}