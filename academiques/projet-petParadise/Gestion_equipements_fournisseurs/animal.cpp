#include "animal.h"
#include <QSqlQuery>
#include<QtDebug>
#include<QObject>

Animal::Animal()
{
id_A=0; age=""; poid=""; prenom=""; etat=""; type=""; race=""; id_N=0;

}


Animal::Animal(int id_A,QString age,QString poid,QString prenom,QString etat ,QString type ,QString race,int id_N)
{
    this->id_A=id_A;
    this->age=age;
    this->poid=poid;
    this->prenom=prenom;
    this->etat=etat;
    this->type=type;
    this->race=race;
    this->id_N=id_N;

}
int Animal::getid_A(){ return id_A;}
QString Animal::getage(){return age;}
QString Animal::getpoid(){return poid;}
QString Animal::getprenom(){return prenom;}
QString Animal:: getetat(){return etat;}
QString Animal:: gettype(){return type;}
QString Animal:: getrace(){return race;}
int Animal::getid_N(){ return id_N;}

void Animal::setid_A(int id_A){this->id_A=id_A;}
void Animal::setage(QString age){this->age=age;}
void Animal::setpoid(QString poid){this->poid=poid;}
void Animal::setprenom(QString prenom){this->prenom=prenom;}
void Animal::setetat(QString etat){this->etat=etat;}
void Animal::settype(QString type){this->type=type;}
void Animal::setrace(QString race){this->race=race;}
void Animal::setid_N(int id_N){this->id_N=id_N;}

bool Animal::ajouter()

{
    QSqlQuery query;
    QString id_string=QString::number(id_A);
    QString id_string1=QString::number(id_N);
          query.prepare("INSERT INTO animal (id_A,type,race,prenom,etat,age,poid,id_N) "
                        "VALUES (:id_A, :type, :race,:prenom,:etat,:age,:poid,:id_N)");

          query.bindValue(":id_A", id_string);
          query.bindValue(":type", type);
          query.bindValue(":race", race);
          query.bindValue(":prenom", prenom);
          query.bindValue(":etat", etat);
          query.bindValue(":age", age);
          query.bindValue(":poid",poid);
          query.bindValue(":id_N", id_string1);
           return query.exec();

}

QSqlQueryModel* Animal::afficher()
{
   QSqlQueryModel* model=new QSqlQueryModel();
   model->setQuery("SELECT* FROM animal");
   model->setHeaderData(0, Qt::Horizontal, QObject::tr("identifiant"));
    model->setHeaderData(1, Qt::Horizontal, QObject::tr("Type"));
     model->setHeaderData(2, Qt::Horizontal, QObject::tr("Race"));
      model->setHeaderData(3, Qt::Horizontal, QObject::tr("Prenom"));
       model->setHeaderData(4, Qt::Horizontal, QObject::tr("Etat"));
        model->setHeaderData(5, Qt::Horizontal, QObject::tr("Age"));
         model->setHeaderData(6, Qt::Horizontal, QObject::tr("Poid"));
          model->setHeaderData(7, Qt::Horizontal, QObject::tr("Nourriture"));

   return model;
}

/*QSqlQueryModel * Animal::rechercher()
{
QSqlQueryModel *model= new QSqlQueryModel();
    QSqlQuery   *query= new QSqlQuery();
    query->prepare("SELECT * FROM animal WHERE id_A  LIKE'"+id_A+"%' or type LIKE'"+type+"%' or race  LIKE'"+race+"%' or prenom LIKE'"+prenom+"%' or etat LIKE'"+etat+"%' or age LIKE'"+age+"%'or poid LIKE'"+poid+"%' or id_N LIKE'"+id_N+"%'");
     query->exec();
     if (query->next()) { }
     else {
         QMessageBox::critical(nullptr, QObject::tr("SEARCH"),
                         QObject::tr("NO MATCH FOUND !.\n"
                                     "Click Cancel to exit."), QMessageBox::Cancel);
         ui->le_id_supp->clear();
         return model;
      }
      */

bool Animal::rechercher()
 {
     QSqlQuery *query = new QSqlQuery;
    query->prepare("select * from Animal where id_A=:id_A");
    if (query->exec())
    {
        return(1);
    }
    return(0);
 }


bool Animal::supprimer(int id_A)
{
 QSqlQuery query;
 QString res=QString::number(id_A);
 query.prepare(" Delete from animal where id_A=:id_A");

    query.bindValue(":id_A",res);

    return query.exec();
}

bool Animal::modifier(int id_A, QString age , QString poid, QString prenom, QString etat, QString type, QString race,int id_N)
{
    QSqlQuery query;
    query.prepare("UPDATE Animal SET id_A= :id_A , age= :age , poid= :poid , prenom= :prenom , etat= :etat , type = :type , race= :race, id_N= :id_N WHERE id_A = :id_A");

    query.bindValue(":id_A", id_A);
    query.bindValue(":age",age );
    query.bindValue(":poid", poid);
    query.bindValue(":prenom", prenom);
    query.bindValue(":etat", etat);

    query.bindValue(":type", type);
    query.bindValue(":race", race);
    query.bindValue(":id_N", id_N);

    return    query.exec();
}


//Métiers:
//Rechercher

QSqlQueryModel * Animal::rechercher_age(QString age)
{
    QSqlQuery qry;
    qry.prepare("select * from Animal where age=:age");
    qry.bindValue(":age",age);
    qry.exec();

    QSqlQueryModel *model= new QSqlQueryModel;
    model->setQuery(qry);


   return model;


}
QSqlQueryModel * Animal::rechercher_type(QString type)
{
    QSqlQuery qry;
    qry.prepare("select * from Animal where type=:type");
    qry.bindValue(":type",type);
    qry.exec();

    QSqlQueryModel *model= new QSqlQueryModel;
    model->setQuery(qry);


   return model;


}
QSqlQueryModel * Animal::rechercher_etat(QString etat)
{
    QSqlQuery qry;
    qry.prepare("select * from Animal where etat=:etat");
    qry.bindValue(":etat",etat);
    qry.exec();

    QSqlQueryModel *model= new QSqlQueryModel;
    model->setQuery(qry);


   return model;


}
QSqlQueryModel * Animal::rechercher_ageType(QString age, QString type)
{
    QSqlQuery *qry= new QSqlQuery();
    qry->prepare("select * from Animal where age=:age and type=:type");
    qry->bindValue(":age",age);
    qry->bindValue(":type",type);
    qry->exec();


       QSqlQueryModel *model = new QSqlQueryModel();
       model->setQuery(*qry);
        return model;


}
QSqlQueryModel * Animal::rechercher_ageEtat(QString age, QString etat)
{
    QSqlQuery *qry= new QSqlQuery();
    qry->prepare("select * from Animal where age=:age and etat=:etat");
    qry->bindValue(":age",age);
    qry->bindValue(":etat",etat);
    qry->exec();

       QSqlQueryModel *model = new QSqlQueryModel();
       model->setQuery(*qry);
        return model;


}
QSqlQueryModel * Animal::rechercher_typeEtat(QString type, QString etat)
{
    QSqlQuery *qry= new QSqlQuery();
    qry->prepare("select * from Animal where type=:type and etat=:etat");
    qry->bindValue(":type",type);
    qry->bindValue(":etat",etat);
    qry->exec();

       QSqlQueryModel *model = new QSqlQueryModel();
       model->setQuery(*qry);
        return model;


}



QSqlQueryModel * Animal::rechercher_tous(QString age,QString type,QString etat)
{
   QSqlQuery *qry= new QSqlQuery();
   qry->prepare("select * from Animal where age=:age and type=:type and etat=:etat");
   qry->bindValue(":age",age);
   qry->bindValue(":type",type);
   qry->bindValue(":etat",etat);
   qry->exec();

      QSqlQueryModel *model = new QSqlQueryModel();
      model->setQuery(*qry);
       return model;

}
void Animal::exporter(QTableView *table)
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

