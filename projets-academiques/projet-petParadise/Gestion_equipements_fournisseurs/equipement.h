#ifndef EQUIPEMENT_H
#define EQUIPEMENT_H
#include <QString>
#include <QSqlQuery>
#include <QTableView>
#include <QSqlQueryModel>
#include <QDate>
#include <QFile>
#include<QFileDialog>


class Equipement
{
public:
    Equipement();
    Equipement(int,QString,QString,QString,int,QString,QString,QDate,int);

    int getref();
    QString getnom();
    QString getmarque();
    QString getprix();
    int getquantite();
    QString getgamme();
    QString gettype();
    QDate getdate_ajout();
    int getfournisseur();

    void setref(int);
    void setnom(QString);
    void setmarque(QString);
    void setprix(QString);
    void setquantite(int);
    void setgamme(QString);
    void settype(QString);
    void setdate_ajout(QDate);
    void setfournisseur(int);


    bool ajouter();
    QSqlQueryModel * afficher();
    bool supprimer(int);
    bool update(int,QString,QString,QString,int,QString,QString,QDate,int);
    void genererpdf(QTableView *table);

    QSqlQueryModel * rechercherref(int);
          QSqlQueryModel * recherchergamme(QString );
          QSqlQueryModel * recherchertype(QString );
          QSqlQueryModel * rechercher(int ,QString,QString);

private:
    int ref,quantite,fournisseur;
    QString nom, marque,prix, gamme, type;
    QDate date_ajout;
};

#endif // EQUIPEMENT_H
