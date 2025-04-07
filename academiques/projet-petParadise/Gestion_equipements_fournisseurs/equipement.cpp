#include "equipement.h"
#include <QSqlQuery>
#include <QDebug>
#include <QtDebug>
#include <QPrinter>
#include <QFileDialog>
#include <QTextDocument>
#include <QApplication>
#include <QObject>

Equipement::Equipement()
{
ref=0; nom=" "; marque=" "; prix=" "; quantite=0; gamme=" "; type=" "; fournisseur=0;
}

Equipement::Equipement(int ref,QString nom,QString marque,QString prix,int quantite,QString gamme,QString type,QDate date_ajout,int fournisseur)
{ this->ref=ref;
    this->nom=nom;
    this->marque=marque;
    this->prix=prix;
    this->quantite=quantite;
    this->gamme=gamme;
    this->type=type;
    this->date_ajout=date_ajout;
    this->fournisseur=fournisseur;
    }

int Equipement::getref(){return ref;}
QString Equipement::getnom(){return nom;}
QString Equipement::getmarque(){return marque;}
QString Equipement::getprix(){return prix;}
int Equipement::getquantite(){return quantite;}
QString Equipement::getgamme(){return gamme;}
QString Equipement::gettype(){return type;}
QDate Equipement::getdate_ajout(){return date_ajout;}
int Equipement::getfournisseur(){return fournisseur;}

void Equipement::setref(int ref){this->ref=ref;}
void Equipement::setnom(QString nom){this->nom=nom;}
void Equipement::setmarque(QString marque){this->marque=marque;}
void Equipement::setprix(QString prix){this->prix=prix;}
void Equipement::setquantite(int quantite){this->quantite=quantite;}
void Equipement::setgamme(QString gamme){this->gamme=gamme;}
void Equipement::settype(QString type){this->type=type;}
void Equipement::setdate_ajout(QDate date_ajout){this->date_ajout=date_ajout;}
void Equipement::setfournisseur(int fournisseur){this->fournisseur=fournisseur;}



bool Equipement::ajouter()
{
    QSqlQuery query;
QString ref_string= QString::number(ref);
QString quantite_string= QString::number(quantite);
QString fournisseur_string= QString::number(fournisseur);

query.prepare("INSERT INTO equipement (ref, nom, marque, prix, quantite, gamme, type, date_ajout, fournisseur)"" VALUES(:ref, :nom, :marque, :prix, :quantite, :gamme, :type, :date_ajout, :fournisseur )" );
query.bindValue(":ref",ref_string);
query.bindValue(":nom",nom);
query.bindValue(":marque",marque);
query.bindValue(":prix",prix);
query.bindValue(":quantite",quantite_string);
query.bindValue(":gamme",gamme);
query.bindValue(":type",type);
query.bindValue(":date_ajout",date_ajout);
query.bindValue(":fournisseur",fournisseur_string);


   return query.exec();

}

QSqlQueryModel * Equipement::afficher()
{
QSqlQueryModel* model=new QSqlQueryModel();
model->setQuery("select* FROM equipement");

model->setHeaderData(0, Qt::Horizontal, QObject::tr("ref"));
model->setHeaderData(1, Qt::Horizontal, QObject::tr("nom"));
model->setHeaderData(2, Qt::Horizontal, QObject::tr("marque"));
model->setHeaderData(3, Qt::Horizontal, QObject::tr("prix"));
model->setHeaderData(4, Qt::Horizontal, QObject::tr("quantite"));
model->setHeaderData(5, Qt::Horizontal, QObject::tr("gamme"));
model->setHeaderData(6, Qt::Horizontal, QObject::tr("type"));
model->setHeaderData(7, Qt::Horizontal, QObject::tr("date_ajout"));
model->setHeaderData(8, Qt::Horizontal, QObject::tr("fourniseur"));
return model;
}

bool Equipement::supprimer(int ref)
{
    QSqlQuery query;
    QString res=QString::number(ref);
        query.prepare("Delete from equipement where ref= :ref");
        query.bindValue(":ref",res);
        return query.exec();
}

void Equipement::genererpdf(QTableView *table)
{

    QString filters("CSV files (*.csv);;All files (*.*)");
    QString defaultFilter("CSV files (*.csv)");
    QString fileName = QFileDialog::getSaveFileName(0, "Save file", QCoreApplication::applicationDirPath(),
                                                    filters, &defaultFilter);
    QFile file(fileName);
    QAbstractItemModel *model =  table->model();
    if (file.open(QFile::WriteOnly | QFile::Truncate))
    {
        QTextStream data(&file);
        QStringList strList;
        for (int i = 0; i < model->columnCount(); i++)
        {
            if (model->headerData(i, Qt::Horizontal, Qt::DisplayRole).toString().length() > 0)
                strList.append("\"" + model->headerData(i, Qt::Horizontal, Qt::DisplayRole).toString() + "\"");
            else
                strList.append("");
        }
        data << strList.join(";") << "\n";
        for (int i = 0; i < model->rowCount(); i++)
        {
            strList.clear();
            for (int j = 0; j < model->columnCount(); j++)
            {

                if (model->data(model->index(i, j)).toString().length() > 0)
                    strList.append("\"" + model->data(model->index(i, j)).toString() + "\"");
                else
                    strList.append("");
            }
            data << strList.join(";") + "\n";
        }
        file.close();
    }
}





bool Equipement:: update(int ref,QString nom,QString marque,QString prix,int quantite,QString gamme, QString type, QDate date_ajout,int fournisseur)
{
QSqlQuery query;

QString ref_string= QString::number(ref);
QString quantite_string= QString::number(quantite);
QString fournisseur_string= QString::number(fournisseur);

query.prepare("UPDATE equipement SET ref= :ref , nom= :nom , marque= :marque , prix= :prix , quantite= :quantite , gamme= :gamme , type= :type, date_ajout= :date_ajout, fournisseur= :fournisseur WHERE ref = :ref");

query.bindValue(":ref",ref_string);
query.bindValue(":nom",nom);
query.bindValue(":marque",marque);
query.bindValue(":prix",prix);
query.bindValue(":quantite",quantite_string);
query.bindValue(":gamme",gamme);
query.bindValue(":type",type);
query.bindValue(":date_ajout",date_ajout);
query.bindValue(":fournisseur",fournisseur_string);


return    query.exec();
}




QSqlQueryModel * Equipement::rechercherref(int ref)

 {
     QSqlQuery qry;
     qry.prepare("select* from equipement where ref=:ref");
     qry.bindValue(":ref",ref);
     qry.exec();
     QSqlQueryModel *model=new QSqlQueryModel;
     model->setQuery(qry);
     return model;
 }

QSqlQueryModel * Equipement::recherchergamme(QString gamme)

 {
     QSqlQuery qry;
     qry.prepare("select* from equipement where gamme=:gamme");
     qry.bindValue(":gamme",gamme);
     qry.exec();
     QSqlQueryModel *model=new QSqlQueryModel;
     model->setQuery(qry);
     return model;
 }


QSqlQueryModel * Equipement::recherchertype(QString type)

 {
     QSqlQuery qry;
     qry.prepare("select* from equipement where type=:type");
     qry.bindValue(":type",type);
     qry.exec();
     QSqlQueryModel *model=new QSqlQueryModel;
     model->setQuery(qry);
     return model;
 }



QSqlQueryModel * Equipement::rechercher(int ref, QString gamme, QString type)

 {
     QSqlQuery qry;
     qry.prepare("select* from equipement where ref=:ref and gamme=:gamme and type=:type ");
     qry.bindValue(":ref",ref);
     qry.bindValue(":gamme",gamme);
     qry.bindValue(":type",type);
     qry.exec();
     QSqlQueryModel *model=new QSqlQueryModel;
     model->setQuery(qry);
     return model;
 }
