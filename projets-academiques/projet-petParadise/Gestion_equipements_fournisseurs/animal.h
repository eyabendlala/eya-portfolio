#ifndef ANIMAL_H
#define ANIMAL_H

#include<QString>
#include<QSqlQueryModel>
#include <QTableView>
#include <QFile>
#include <QFileDialog>
#include <QApplication>
#include <QPrinter>
#include <QTextDocument>
#include <QSqlQuery>


class Animal
{
public:
    Animal();
    Animal(int,QString,QString,QString,QString,QString,QString,int);

    int getid_A();
    QString getage();
    QString getpoid();
    QString getprenom();
    QString getetat();
    QString gettype();
    QString getrace();
    int getid_N();

    void setid_A(int);
    void setage(QString);
    void setpoid(QString);
    void setprenom(QString);
    void setetat(QString);
    void settype(QString);
    void setrace(QString);
    void setid_N(int);

    bool ajouter();
    QSqlQueryModel* afficher();
    bool supprimer(int);
    bool modifier(int,QString,QString,QString,QString,QString,QString,int);

    QSqlQueryModel * rechercher_age(QString);
    QSqlQueryModel * rechercher_type(QString);
    QSqlQueryModel * rechercher_etat(QString);
    QSqlQueryModel * rechercher_ageType(QString,QString);
    QSqlQueryModel * rechercher_ageEtat(QString,QString);
    QSqlQueryModel * rechercher_typeEtat(QString,QString);
    QSqlQueryModel * rechercher_tous(QString,QString,QString);
    void exporter(QTableView *table);

    bool rechercher();










 private:
int id_A,id_N;
QString prenom,etat,type,race,age,poid;

};

#endif // ANIMAL_H
