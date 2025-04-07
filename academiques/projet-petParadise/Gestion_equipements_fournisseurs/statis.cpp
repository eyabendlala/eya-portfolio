#include "statis.h"
#include "ui_statis.h"
#include <QString>
#include"animal.h"
#include<qsqlquery.h>

statis::statis(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::statis)
{
    ui->setupUi(this);
}

statis::~statis()
{
    delete ui;
}
void statis::make()
{
        int animal_malade;
        int animal_en_bonne_sante;
        int total;
        QString Animal_malade;
        QString Animal_en_bonne_sante;

        QSqlQuery q;

        q.prepare("SELECT COUNT(id_A) FROM animal where etat ='Animal malade' ");
        q.exec();
        q.first() ;
        Animal_malade=(q.value(0).toInt());

        q.prepare("SELECT COUNT(id_A) FROM animal where etat ='Animal en bonne sante' ");
        q.exec();
        q.first() ;
        Animal_en_bonne_sante=(q.value(0).toInt());
        q.prepare("SELECT COUNT(id_A) FROM animal ");
        q.exec();
        q.first() ;
        total=(q.value(0).toInt());

        animal_en_bonne_sante=((double)animal_en_bonne_sante/(double)total)*100;
        animal_malade=100-animal_en_bonne_sante;

        Animal_malade= QString::number(animal_malade);
        Animal_en_bonne_sante=QString::number(animal_en_bonne_sante);
        QPieSeries *series;
         series= new  QPieSeries();
         series->append("ANIMAL_MALADE"+Animal_malade+"%",animal_malade);
         series->append("ANIMAL_EN_BONNE_SANTE"+Animal_en_bonne_sante+"%",animal_en_bonne_sante);
         QPieSlice *slice0 = series->slices().at(0);
          slice0->setLabelVisible();

          QPieSlice *slice1 = series->slices().at(1);
             slice1->setExploded();
             slice1->setLabelVisible();
             slice1->setPen(QPen(Qt::darkRed, 2));
             slice1->setBrush(Qt::black);

              QChart *chart = new QChart();
              chart->addSeries(series);
              chart->setTitle("Statistiques sur l'etat des animaux ");
              chart->legend()->show();
              QChartView *chartView = new QChartView(chart);
              chartView->setRenderHint(QPainter::Antialiasing);
              ui->verticalLayout->addWidget(chartView);

}
