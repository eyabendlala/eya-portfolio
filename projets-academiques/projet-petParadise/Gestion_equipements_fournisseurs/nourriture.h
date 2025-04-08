#ifndef NOURRITURE_H
#define NOURRITURE_H
#include<QString>
#include<QSqlQueryModel>

class Nourriture
{
public:
    Nourriture();
    Nourriture(int,QString,QString,QString,QString);
    int getid_N();
    QString getconsommateur();
    QString gettype();
    QString getmarque();
    QString getquantite();

    void setid_N(int);
    void setconsommateur(QString);
    void settype(QString);
    void setmarque(QString);
    void setquantite(QString);

    bool ajouter();
    QSqlQueryModel* afficher();
    bool supprimer(int);
    bool modifier(int,QString,QString,QString,QString);
    //QSqlQueryModel* triNourriture(int);



   private:
    int id_N;
    QString consommateur,type,marque,quantite;
};

#endif // NOURRITURE_H
