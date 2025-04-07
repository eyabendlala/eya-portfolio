#include "nourriture.h"
#include <QSqlQuery>
#include<QtDebug>

Nourriture::Nourriture()
{
id_N=0; consommateur=""; type=""; marque=""; quantite="";

}

Nourriture::Nourriture(int id_N,QString consommateur,QString type,QString marque ,QString quantite)
{
    this->id_N=id_N;
    this->consommateur=consommateur;
    this->type=type;
    this->marque=marque;
    this->quantite=quantite;
}
int Nourriture::getid_N(){ return id_N;}
QString Nourriture::getconsommateur(){return consommateur;}
QString Nourriture::gettype(){return type;}
QString Nourriture::getmarque(){return marque;}
QString Nourriture:: getquantite(){return quantite;}

void Nourriture::setid_N(int id_N){this->id_N=id_N;}
void Nourriture::setconsommateur(QString consommateur){this->consommateur=consommateur;}
void Nourriture::settype(QString type){this->type=type;}
void Nourriture::setmarque(QString marque){this->marque=marque;}
void Nourriture::setquantite(QString quantite){this->quantite=quantite;}
 bool Nourriture:: ajouter()
{
    QSqlQuery query;
    QString id_string=QString::number(id_N);
      query.prepare("INSERT INTO nourriture (id_N,consommateur,type,marque,quantite) "
         "VALUES (:id_N, :consommateur,:type,:marque,:quantite)");

          query.bindValue(":id_N", id_string);
          query.bindValue(":consommateur",consommateur);
          query.bindValue(":type", type);
          query.bindValue(":marque", marque);
          query.bindValue(":quantite", quantite);
          return query.exec();

}

 QSqlQueryModel* Nourriture::afficher()
 {
    QSqlQueryModel* model=new QSqlQueryModel();
    model->setQuery("SELECT* FROM nourriture");
    model->setHeaderData(0, Qt::Horizontal, QObject::tr("identifiant"));
     model->setHeaderData(1, Qt::Horizontal, QObject::tr("Consommateur"));
     model->setHeaderData(2, Qt::Horizontal, QObject::tr("Type"));
      model->setHeaderData(3, Qt::Horizontal, QObject::tr("Marque"));
       model->setHeaderData(4, Qt::Horizontal, QObject::tr("Quantite"));
    return model;
 }

 bool Nourriture::supprimer(int id_N)
 {
  QSqlQuery query;
  query.prepare(" Delete from nourriture where id_N=:id_N");

     query.bindValue(0,id_N);

     return query.exec();
 }


 bool Nourriture::modifier(int id_N, QString consommateur, QString type, QString marque, QString quantite)
 {
     QSqlQuery query;
     query.prepare("UPDATE nourriture SET id_N= :id_N , consommateur= :consommateur , type= :type , marque= :marque , quantite= :quantite  WHERE id_N = :id_N");

     query.bindValue(":id_N", id_N);
     query.bindValue(":consommateur",consommateur );
     query.bindValue(":type", type);
     query.bindValue(":marque", marque);
     query.bindValue(":quantite", quantite);

     return    query.exec();
 }
/*
 QString test_tri(int c)
 {
     if (c==0)
     {
         return "ress" ;
     }
     else if (c==1)
     {
         return "id-N";
     }
 else if (c==2)
     {
         return "type";
     }
     else if (c==3)
     {
         return "quantite";
     }

     return "NULL";
 }
 QSqlQueryModel* Nourriture::triNourriture(int i)
 {

     QString col = test_tri(i);
     QSqlQueryModel *model = new QSqlQueryModel() ;

     QString header = "SELECT * FROM nourriture ORDER BY "+col;
     model->setQuery(header);
     model->setHeaderData(0, Qt::Horizontal, QObject::tr("id_N"));
     model->setHeaderData(1, Qt::Horizontal, QObject::tr("consommateur"));
     model->setHeaderData(2,Qt::Horizontal,QObject::tr("type"));
     model->setHeaderData(3,Qt::Horizontal,QObject::tr("marque"));
     model->setHeaderData(4, Qt::Horizontal, QObject::tr("quantite"));

     return model;
 }

*/

