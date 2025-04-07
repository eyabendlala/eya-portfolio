#ifndef STATIS_H
#define STATIS_H


#include<QtCharts>
#include<QChartView>
#include<QPieSeries>
#include<QPieSlice>

#include <QWidget>

namespace Ui {
class statis;
}

class statis : public QWidget
{
    Q_OBJECT

public:
    explicit statis(QWidget *parent = nullptr);
     void make();
    ~statis();

private:
    Ui::statis *ui;
};

#endif // STATIS_H
