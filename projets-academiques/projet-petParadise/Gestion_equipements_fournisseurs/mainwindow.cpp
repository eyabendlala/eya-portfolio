#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "animal.h"
#include "nourriture.h"
#include <QMessageBox>
#include <QSqlTableModel>
#include <QTableView>
#include <QtDebug>
#include <QIntValidator>
#include "statis.h"
#include <QTableWidgetItem>
#include <QItemSelectionModel>
#include<qsqlquery.h>


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);


    //Animal
    ui->lineEdit_id->setValidator(new QIntValidator(100, 9999999, this));
    ui->tab_animal->setModel(A.afficher());
    //Nourriture
     ui->lineEdit_id_2->setValidator(new QIntValidator(100, 9999999, this));
     ui->tab_nourriture->setModel(N_temp.afficher());

}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::on_pb_ajouter_clicked()
{

    int id_A=ui->lineEdit_id->text().toInt();
    QString  prenom=ui->le_prenom->text();
    QString age=ui->le_age->text();
    QString poid=ui->le_poid->text();
    QString  etat=ui->comboBox->currentText();
    QString  type=ui->le_type->text();
    QString  race=ui->le_race->text();
    int id_N=ui->lineEdit_id_3->text().toInt();
    Animal A(id_A,age,poid,prenom,etat,type,race,id_N);

    bool test=A.ajouter();
    if(id_A==0||prenom==""||etat==""||type==""||race==""||age==""||poid==""||id_N==0)
    {
       QMessageBox::critical(nullptr, QObject::tr("vide"),
                                        QObject::tr("veuillez saisir tous les champs correctement!\n"), QMessageBox::Cancel);


    }

      else if(test==true){
       QMessageBox::information(nullptr, QObject::tr("OK"),
                       QObject::tr("Animal ajouté:\n"
            "click cancel to exit"),QMessageBox::Cancel);
 ui->tab_animal->setModel(A.afficher());

    }
    else{QMessageBox::information(nullptr, QObject::tr("chec d'ajout"),
                                  QObject::tr("Animal existe deja:\n"
                       "click cancel to exit"),QMessageBox::Cancel);}




}

void MainWindow::on_pb_supprimer_clicked()
{
Animal A1;
//int id_A=ui->lineEdit_id->text().toInt();
A1.setid_A(ui->le_id_supp->text().toInt());
bool test=A1.supprimer(A1.getid_A());

    if(test==true)
     {    QMessageBox::information(nullptr, QObject::tr("supp avec succes"),
                                   QObject::tr("sup successful.\n"
                                               "Click Cancel to exit."), QMessageBox::Cancel);
ui->tab_animal->setModel(A1.afficher());
               }
                   else
                       QMessageBox::critical(nullptr, QObject::tr("Echec de Suppression "),
                                   QObject::tr("L'id n'existe pas dans la table.\n"
                                               "Click Cancel to exit."), QMessageBox::Cancel);
}

void MainWindow::on_pb_modifier_clicked()
{
    int id_A= ui->lineEdit_id->text().toInt();
    QString age= ui->le_age->text();
    QString poid= ui->le_poid->text();
    QString prenom=ui->le_prenom->text();
    QString etat= ui->comboBox->currentText();
    QString type=ui->le_type->text();
    QString race=ui->le_race->text();
    int id_N= ui->lineEdit_id_3->text().toInt();

    Animal A(id_A,age,poid,prenom,etat,type,race,id_N);

       bool test = A.modifier(id_A,age,poid,prenom,etat,type,race,id_N);

            if(test)

            {
                 ui->tab_animal->setModel(A.afficher());
                QMessageBox::information(nullptr, QObject::tr("update "),
                            QObject::tr("Animal modifie\n"
            "Click Cancel to exit."), QMessageBox::Cancel);}
            else
                QMessageBox::critical(nullptr, QObject::tr("update "),
                         QObject::tr("Animal non modifie\n"
         "Click Cancel to exit."), QMessageBox::Cancel);

}

void MainWindow::on_rechercher_anim_clicked()
{

    if (ui->checkBox_age->isChecked())
    { QString age=ui->rech_age->text();
        QSqlQueryModel *verif=A.rechercher_age(age);
        if (verif != nullptr)
        {
            ui->tab_animal->setModel(verif);
            QMessageBox::information(nullptr, QObject::tr("Recherche Animal"),
                        QObject::tr("Recherche affecté sur l'animal.\n"
                                    "Click Cancel to exit."), QMessageBox::Cancel);
        }
     }

    if (ui->checkBox_type->isChecked())
    { QString type=ui->rech_type->text();
        QSqlQueryModel *verif=A.rechercher_type(type);
        if (verif != nullptr)
        {
            QMessageBox msgBox ;
            ui->tab_animal->setModel(verif);
            msgBox.setText("recherche bien affecté sur Type");
        }
     }
    if (ui->checkBox_etat->isChecked())
    { QString etat=ui->rech_etat->currentText();
        QSqlQueryModel *verif=A.rechercher_etat(etat);
        if (verif != nullptr)
        {
            QMessageBox msgBox ;
            ui->tab_animal->setModel(verif);
            msgBox.setText("recherche bien affecté sur l'état");
        }
     }
    if ((ui->checkBox_age->isChecked())&&(ui->checkBox_type->isChecked()))
    {
        QString age=ui->rech_age->text();
        QString type=ui->rech_type->text();

                    if (age!="")
                      {
                        if (type!="")
                           {
                    QSqlQueryModel *verif=A.rechercher_ageType(age,type);
                    if (verif!=nullptr)
                    {   QMessageBox msgBox ;
                        ui->tab_animal->setModel(verif);
                        msgBox.setText("recherche bien affecté sur age et type");
                    }
                        } else
                            QMessageBox::warning(this,"erreur","Champ type est vide");
                    } else
                        QMessageBox::warning(this,"erreur","Champ age est vide");
    }
    if ((ui->checkBox_age->isChecked())&&(ui->checkBox_etat->isChecked()))
    {
        QString age=ui->rech_age->text();
        QString etat=ui->rech_etat->currentText();

                    if (age!="")
                      {
                    QSqlQueryModel *verif=A.rechercher_ageEtat(age,etat);
                    if (verif!=nullptr)
                    {   QMessageBox msgBox ;
                        ui->tab_animal->setModel(verif);
                        msgBox.setText("recherche bien affecté sur age et etat");
                    }

                    } else
                        QMessageBox::warning(this,"erreur","Champ age est vide");
    }
    if ((ui->checkBox_type->isChecked())&&(ui->checkBox_etat->isChecked()))
    {
       QString type=ui->rech_type->text();
       QString etat=ui->rech_etat->currentText();

                    if (type!="")
                      {
                    QSqlQueryModel *verif=A.rechercher_typeEtat(type,etat);
                    if (verif!=nullptr)
                    {   QMessageBox msgBox ;
                        ui->tab_animal->setModel(verif);
                        msgBox.setText("recherche bien affecté sur Type et Etat");
                    }

                    } else
                        QMessageBox::warning(this,"erreur","Champ Type est vide");
    }


 if ((ui->checkBox_age->isChecked())&&(ui->checkBox_type->isChecked())&&(ui->checkBox_etat->isChecked()))
 {

     QString age=ui->rech_age->text();
     QString  type=ui->rech_type->text();
     QString etat=ui->rech_etat->currentText();

                 if (age!="")
                   {
                     if (type!="")
                        {
                 QSqlQueryModel *verif=A.rechercher_tous(age,type,etat);
                 if (verif!=nullptr)
                 {
                     QMessageBox msgBox ;
                     ui->tab_animal->setModel(verif);
                     msgBox.setText("recherche bien affecté sur les 3 critéres");
                 }
                     } else
                         QMessageBox::warning(this,"erreur","Champ type est vide");
                 } else
                     QMessageBox::warning(this,"erreur","Champ age est vide");

 } // else QMessageBox::warning(this,"erreur","Aucun critére n'est coché");
}

void MainWindow::on_reafficher_anim_clicked()
{
    ui->rech_age->setText("");
    ui->rech_type->setText("");
    ui->rech_etat->setCurrentText("");
    ui->tab_animal->setModel(A.afficher());

 }

void MainWindow::on_reset_clicked()
{
    ui->lineEdit_id->setText("");
    ui->le_age->setText("");
    ui->le_poid->setText("");
    ui->le_prenom->setText("");
    ui->comboBox->setCurrentText("");
    ui->le_type->setText("");
    ui->le_race->setText("");
    ui->lineEdit_id_3->setText("");
}

void MainWindow::on_stat_clicked()
{

    statis *w = new statis();
    w->make();
    w->show();

}

void MainWindow::on_pb_ajouter_2_clicked()
{

int id_N=ui->lineEdit_id_2->text().toInt();
QString  consommateur=ui->le_consommateur->text();
QString  type=ui->le_type_2->text();
QString  marque=ui->le_marque->text();
QString  quantite=ui->le_quantite->text();
Nourriture N(id_N,consommateur,type,marque,quantite);

bool test=N.ajouter();
if(id_N==0||consommateur==""||type==""||marque==""||quantite=="")
{
   QMessageBox::critical(nullptr, QObject::tr("vide"),
                                    QObject::tr("veuillez saisir tous les champs correctement!\n"), QMessageBox::Cancel);


}

  else if(test==true){
   QMessageBox::information(nullptr, QObject::tr("OK"),
                   QObject::tr("Nourriture ajouté:\n"
        "click cancel to exit"),QMessageBox::Cancel);
ui->tab_nourriture->setModel(N_temp.afficher());

}
else{QMessageBox::information(nullptr, QObject::tr("chec d'ajout"),
                              QObject::tr("Nourriture existe deja:\n"
                   "click cancel to exit"),QMessageBox::Cancel);}

}






/*
bool test=A.ajouter();
if(id_A==0||prenom==""||etat==""||type==""||race==""||age==""||poid==""||id_N==0)
{
   QMessageBox::critical(nullptr, QObject::tr("vide"),
                                    QObject::tr("veuillez saisir tous les champs correctement!\n"), QMessageBox::Cancel);


}

  else if(test==true){
   QMessageBox::information(nullptr, QObject::tr("OK"),
                   QObject::tr("Animal ajouté:\n"
        "click cancel to exit"),QMessageBox::Cancel);
ui->tab_animal->setModel(A.afficher());

}
else{QMessageBox::information(nullptr, QObject::tr("chec d'ajout"),
                              QObject::tr("Animal existe deja:\n"
                   "click cancel to exit"),QMessageBox::Cancel);}

*/
void MainWindow::on_pb_supprimer_2_clicked()
{
    Nourriture N1;
    N1.setid_N(ui->le_id_supp_2->text().toInt());

    bool test=N1.supprimer(N1.getid_N());

        QMessageBox msgBox;
        if(test)
           { msgBox.setText("Suppression avec succes.");
            ui->tab_nourriture->setModel(N1.afficher());}
        else
            msgBox.setText("Echec de suppression");
            msgBox.exec();



}

void MainWindow::on_pb_modifier_2_clicked()
{
   int id_N= ui->lineEdit_id_2->text().toInt();
   QString consommateur= ui->le_consommateur->text();
   QString type= ui->le_type_2->text();
   QString marque=ui->le_marque->text();
   QString quantite= ui->le_quantite->text();

     Nourriture N_temp (id_N,consommateur,type,marque,quantite);

    bool test = N_temp.modifier(id_N,consommateur,type,marque,quantite);

            if(test)

            {
                 ui->tab_nourriture->setModel(N_temp.afficher());
                QMessageBox::information(nullptr, QObject::tr("update "),
                            QObject::tr("Nourriture modifie\n"
            "Click Cancel to exit."), QMessageBox::Cancel);}
            else
                QMessageBox::critical(nullptr, QObject::tr("update "),
                         QObject::tr("Nourriture non modifie\n"
         "Click Cancel to exit."), QMessageBox::Cancel);

}

void MainWindow::on_reset_2_clicked()
{
    ui->lineEdit_id_2->setText("");
    ui->le_consommateur->setText("");
    ui->le_type_2->setText("");
    ui->le_marque->setText("");
    ui->le_quantite->setText("");

}

void MainWindow::on_exporter_clicked()
{

    QString fileName = QFileDialog::getSaveFileName((QWidget* )0, "Export PDF", QString(), "*.pdf");
       if (QFileInfo(fileName).suffix().isEmpty()) { fileName.append("liste_animaux.pdf"); }

       QPrinter printer(QPrinter::PrinterResolution);
       printer.setOutputFormat(QPrinter::PdfFormat);
       printer.setPaperSize(QPrinter::A4);
       printer.setOutputFileName(fileName);

       QTextDocument doc;
       QSqlQuery q;
       q.prepare("SELECT * FROM animal ");
       q.exec();
       QString pdf="<br> <img src='/C:/Users/LENOVO/Documents/build-Gestion-Animal-Desktop_Qt_5_9_9_MinGW_32bit-Debug/cc.png' height='200' width='600'/> <h1  style='color:brown'>       LISTE DES ANIMAUX  <br></h1>\n <br> <table>  <tr>  <th> Identifiant </th> <th> Type </th> <th> Race </th> <th> Prenom  </th> <th> Etat </th> <th> Age </th> <th> Poid </th> <th> Nourriture </th> </tr>" ;


       while ( q.next()) {

           pdf= pdf+ " <br> <tr> <td>"+ q.value(0).toString()+"    </td>  <td>   " + q.value(1).toString() +"</td>  <td>" +q.value(2).toString() +"  "" " "</td>      <td>     "+q.value(3).toString()+"--------"+"</td>       <td>"+q.value(4).toString()+" <td>"+q.value(5).toString()+" <td>"+q.value(6).toString()+" <td>   " + q.value(7).toString() +"</td>       </td>"   ;

       }
       doc.setHtml(pdf);
       doc.setPageSize(printer.pageRect().size()); // This is necessary if you want to hide the page number
       doc.print(&printer);

}

void MainWindow::on_le_id_supp_textChanged(const QString &arg1)
{


    QSqlQueryModel *model= new QSqlQueryModel();
        QSqlQuery   *query= new QSqlQuery();
        query->prepare("SELECT * FROM animal WHERE id_A  LIKE'"+ arg1+"%'");
         query->exec();
         if (query->next()) { }
         else {
             QMessageBox::critical(nullptr, QObject::tr("SEARCH"),
                             QObject::tr("NO MATCH FOUND !.\n"
                                         "Click Cancel to exit."), QMessageBox::Cancel);
             ui->le_id_supp->clear();



}}



void MainWindow::on_le_id_supp_2_textChanged(const QString &arg1)
{
    QSqlQueryModel *model= new QSqlQueryModel();
        QSqlQuery   *query= new QSqlQuery();
        query->prepare("SELECT * FROM nourriture WHERE id_N  LIKE'"+ arg1+"%'");
         query->exec();
         if (query->next()) { }
         else {
             QMessageBox::critical(nullptr, QObject::tr("SEARCH"),
                             QObject::tr("NO MATCH FOUND !.\n"
                                         "Click Cancel to exit."), QMessageBox::Cancel);
             ui->le_id_supp_2->clear();
}
}



/*void MainWindow::on_comboBox_2_currentIndexChanged(int index)
{
    if (index==0)
    {
        ui->tab_nourriture->setModel(N_temp.afficher());
    }
    else
    {
        ui->tab_nourriture->setModel(N_temp.triNourriture(index));
    }
}*/

void MainWindow::on_radioButton_type_clicked()
{
    QMessageBox msgBox ;
            QSqlQueryModel * model= new QSqlQueryModel();



               model->setQuery("select * from nourriture order by type");

               model->setHeaderData(0, Qt::Horizontal, QObject::tr("id_N"));
               model->setHeaderData(1, Qt::Horizontal, QObject::tr("consommateur"));
               model->setHeaderData(2, Qt::Horizontal, QObject::tr("type"));
                model->setHeaderData(4, Qt::Horizontal, QObject::tr("marque"));
               model->setHeaderData(3, Qt::Horizontal, QObject::tr("quantite"));
                        ui->tableViewT->setModel(model);
                        ui->tableViewT->show();
                        msgBox.setText("Tri avec succés.");
                        msgBox.exec();
}

void MainWindow::on_radioButton_quantite_clicked()
{
    QMessageBox msgBox ;
            QSqlQueryModel * model= new QSqlQueryModel();



               model->setQuery("select * from nourriture order by CAST(quantite as varchar) asc");

               model->setHeaderData(0, Qt::Horizontal, QObject::tr("id_N"));
               model->setHeaderData(1, Qt::Horizontal, QObject::tr("consommateur"));
               model->setHeaderData(2, Qt::Horizontal, QObject::tr("type"));
                model->setHeaderData(4, Qt::Horizontal, QObject::tr("marque"));
               model->setHeaderData(3, Qt::Horizontal, QObject::tr("quantite"));

                        ui->tableViewT->setModel(model);
                        ui->tableViewT->show();
                        msgBox.setText("Tri avec succés.");
                        msgBox.exec();
}

void MainWindow::on_radioButton_id_clicked()
{
    QMessageBox msgBox ;
            QSqlQueryModel * model= new QSqlQueryModel();



               model->setQuery("select * from nourriture order by CAST(id_N as INT) asc");

               model->setHeaderData(0, Qt::Horizontal, QObject::tr("id_N"));
               model->setHeaderData(1, Qt::Horizontal, QObject::tr("consommateur"));
               model->setHeaderData(2, Qt::Horizontal, QObject::tr("type"));
                model->setHeaderData(4, Qt::Horizontal, QObject::tr("marque"));
               model->setHeaderData(3, Qt::Horizontal, QObject::tr("quantite"));
                        ui->tableViewT->setModel(model);
                        ui->tableViewT->show();
                        msgBox.setText("Tri avec succés.");
                        msgBox.exec();
}
