#include "fournisseur.h"
#include <QSqlQuery>
#include <QDebug>
#include <QPrinter>
#include <QFileDialog>
#include <QTextDocument>
#include <QApplication>

fournisseur::fournisseur()
{
id_f=0; nom=" "; prenom=" "; tel=0; adresse=" "; rib=0; mail=" ";
}


fournisseur::fournisseur(int id_f,QString nom,QString prenom,int tel,QString adresse,int rib,QString mail)
{ this->id_f=id_f;
    this->nom=nom;
    this->prenom=prenom;
    this->tel=tel;
    this->adresse=adresse;
    this->rib=rib;
    this->mail=mail;
    }

int fournisseur::getid_f(){return id_f;}
QString fournisseur::getnom(){return nom;}
QString fournisseur::getprenom(){return prenom;}
int fournisseur::gettel(){return tel;}
QString fournisseur::getadresse(){return adresse;}
int fournisseur::getrib(){return rib;}
QString fournisseur::getmail(){return mail;}

void fournisseur::setid_f(int id_f){this->id_f=id_f;}
void fournisseur::setnom(QString nom){this->nom=nom;}
void fournisseur::setprenom(QString prenom){this->prenom=prenom;}
void fournisseur::settel(int tel){this->tel=tel;}
void fournisseur::setadresse(QString adresse ){this->adresse=adresse;}
void fournisseur::setrib(int rib){this->rib=rib;}
void fournisseur::setmail(QString mail){this->mail=mail;}


bool fournisseur::ajouter()
{
    QSqlQuery query;
QString id_f_string= QString::number(id_f);
QString tel_string= QString::number(tel);
QString rib_string= QString::number(rib);

query.prepare("INSERT INTO fournisseur (id_f, nom, prenom, tel, adresse, rib, mail)"" VALUES(:id_f, :nom, :prenom, :tel, :adresse, :rib, :mail)" );
query.bindValue(":id_f",id_f_string);
query.bindValue(":nom",nom);
query.bindValue(":marque",prenom);
query.bindValue(":tel",tel_string);
query.bindValue(":adresse",adresse);
query.bindValue(":rib",rib_string);
query.bindValue(":mail",mail);

   return query.exec();

}

QSqlQueryModel * fournisseur::afficher()
{
QSqlQueryModel* model=new QSqlQueryModel();
model->setQuery("select* FROM fournisseur");
model->setHeaderData(0, Qt::Horizontal, QObject::tr("id du fournisseur"));
model->setHeaderData(1, Qt::Horizontal, QObject::tr("nom"));
model->setHeaderData(2, Qt::Horizontal, QObject::tr("prenom"));
model->setHeaderData(3, Qt::Horizontal, QObject::tr("tel"));
model->setHeaderData(4, Qt::Horizontal, QObject::tr("adresse"));
model->setHeaderData(5, Qt::Horizontal, QObject::tr("rib"));
model->setHeaderData(6, Qt::Horizontal, QObject::tr("mail"));

return model;
}

bool fournisseur::supprimer(int id_f)
{
    QSqlQuery query;
    QString res=QString::number(id_f);
        query.prepare("Delete from fournisseur where id_f= :id_f");
        query.bindValue(":id_f",res);
        return query.exec();
}


bool fournisseur::update(int id_f,QString nom,QString prenom,int tel,QString adresse,int rib, QString mail)
{

    QSqlQuery query;
QString id_f_string= QString::number(id_f);
QString tel_string= QString::number(tel);
QString rib_string= QString::number(rib);

query.prepare("UPDATE fournisseur SET id_f= :id_f , nom= :nom , prenom= :prenom , tel= :tel , adresse= :adresse , rib= :rib , mail= :mail");
query.bindValue(":id_f",id_f_string);
query.bindValue(":nom",nom);
query.bindValue(":marque",prenom);
query.bindValue(":tel",tel_string);
query.bindValue(":adresse",adresse);
query.bindValue(":rib",rib_string);
query.bindValue(":mail",mail);

   return query.exec();

}
