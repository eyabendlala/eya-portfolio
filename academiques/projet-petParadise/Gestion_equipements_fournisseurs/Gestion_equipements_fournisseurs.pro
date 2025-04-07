QT       += core gui sql
QT += charts
QT       += sql printsupport
QT += network
QT += serialport
INCLUDEPATH += inc
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets


TARGET = Gestion_equipements_fournisseurs
CONFIG += c++11

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    animal.cpp \
    arduino.cpp \
    connection.cpp \
    equipement.cpp \
    excel.cpp \
    fournisseur.cpp \
    main.cpp \
    mainwindow.cpp \
    nourriture.cpp \
    smtp.cpp \
    stati.cpp \
    statis.cpp

HEADERS += \
    animal.h \
    arduino.h \
    connection.h \
    equipement.h \
    excel.h \
    fournisseur.h \
    mainwindow.h \
    nourriture.h \
    smtp.h \
    stati.h \
    statis.h

FORMS += \
    mainwindow.ui \
    stati.ui \
    statis.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target





