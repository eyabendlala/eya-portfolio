#include "stati.h"
#include "ui_stati.h"
#include <QString>
#include<qsqlquery.h>
#include "equipement.h"

stati::stati(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::stati)
{
    ui->setupUi(this);
}

stati::~stati()
{
    delete ui;
}

void stati::make()
{
        int accessoires;
        int conteneurs_nourriture;

        int total;

        QString Accessoires;
        QString Conteneurs_Nourriture;

        QSqlQuery q;

        q.prepare("SELECT COUNT(ref) FROM equipement where type ='Accessoires' ");
        q.exec();
        q.first() ;
        accessoires=(q.value(0).toInt());

        q.prepare("SELECT COUNT(ref) FROM equipement where type ='Conteneurs nourriture' ");
        q.exec();
        q.first() ;
        conteneurs_nourriture=(q.value(0).toInt());

        q.prepare("SELECT COUNT(cin) FROM equipement  ");
        q.exec();
        q.first() ;
        total=(q.value(0).toInt());

        accessoires=((double)accessoires/(double)total)*100;
        conteneurs_nourriture=100-accessoires;

        Accessoires= QString::number(accessoires);
        Conteneurs_Nourriture=QString::number(conteneurs_nourriture);
        QPieSeries *series;
         series= new  QPieSeries();
         series->append("ACCESSOIRES"+Accessoires+"%",accessoires);
         series->append("CONTENEURS_NOURRITURE"+Conteneurs_Nourriture+"%",conteneurs_nourriture);
         QPieSlice *slice0 = series->slices().at(0);
          slice0->setLabelVisible();

          QPieSlice *slice1 = series->slices().at(1);
             slice1->setExploded();
             slice1->setLabelVisible();
             slice1->setPen(QPen(Qt::darkRed, 2));
             slice1->setBrush(Qt::black);

              QChart *chart = new QChart();
              chart->addSeries(series);
              chart->setTitle("Statistiques sur les types d'equipements ");
              chart->legend()->show();
              QChartView *chartView = new QChartView(chart);
              chartView->setRenderHint(QPainter::Antialiasing);
              ui->verticalLayout->addWidget(chartView);

}
