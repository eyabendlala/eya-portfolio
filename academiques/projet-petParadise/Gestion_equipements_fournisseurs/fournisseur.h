#ifndef FOURNISSEUR_H
#define FOURNISSEUR_H
#include <QString>
#include <QSqlQuery>
#include <QTableView>
#include <QSqlQueryModel>
#include <QFile>
#include<QFileDialog>

class fournisseur
{
public:
    fournisseur();
    fournisseur(int,QString,QString,int,QString,int,QString);
    int getid_f();
    QString getnom();
    QString getprenom();
    int gettel();
    QString getadresse();
    int getrib();
    QString getmail();

    void setid_f(int);
    void setnom(QString);
    void setprenom(QString);
    void settel(int);
    void setadresse(QString);
    void setrib(int);
    void setmail(QString);

    bool ajouter();
    QSqlQueryModel * afficher();
    bool supprimer(int);
    bool update(int,QString,QString,int,QString,int,QString);

private:
    int id_f, tel, rib;
    QString nom, prenom, adresse, mail;

};

#endif // FOURNISSEUR_H
