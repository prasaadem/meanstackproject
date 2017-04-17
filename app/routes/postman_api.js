    //http://localhost:PORT/api/addAdmin
    //Admin Registration Route

    router.post('/addAdmin',function(req,res){
        var admin = new User();
        admin.username = req.body.username;
        admin.email = req.body.email;
        admin.uin = req.body.uin;
        admin.permission = req.body.permission;
        admin.accountExpires = req.body.accountExpires;
        admin.name = req.body.name;
        admin.directoryName = req.body.directoryName;
        admin.major = req.body.major;
        admin.classification = req.body.classification;
        admin.password = req.body.password;
        admin.courses = [];

        console.log(admin);
        admin.save(function(err){
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }else{
                res.json({
                    success: true,
                    message: 'Admin Created in the database successfully!',
                    admin: admin
                });
            }
        });
    });

    //http://localhost:PORT/api/addFaculty
    //Faculty Registration Route

    router.post('/addFaculty',function(req,res){
        var faculty = new User();
        faculty.username = req.body.username;
        faculty.email = req.body.email;
        faculty.uin = req.body.uin;
        faculty.permission = req.body.permission;
        faculty.accountExpires = req.body.accountExpires;
        faculty.name = req.body.name;
        faculty.directoryName = req.body.directoryName;
        faculty.major = req.body.major;
        faculty.classification = req.body.classification;
        faculty.password = req.body.password;
        faculty.courses = [];

        console.log(faculty);
        faculty.save(function(err){
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }else{
                res.json({
                    success: true,
                    message: 'Faculty Created in the database successfully!',
                    admin: faculty
                });
            } 
        });
    });

    //http://localhost:PORT/api/addStudent
    //Student Registration Route

    router.post('/addStudent',function(req,res){
        var student = new User();
        student.username = req.body.username;
        student.email = req.body.email;
        student.uin = req.body.uin;
        student.permission = req.body.permission;
        student.accountExpires = req.body.accountExpires;
        student.name = req.body.name;
        student.directoryName = req.body.directoryName;
        student.major = req.body.major;
        student.classification = req.body.classification;
        student.password = req.body.password;
        student.courses = [];

        console.log(student);
        student.save(function(err){
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            }else{
                res.json({
                    success: true,
                    message: 'Student Created in the database successfully!',
                    admin: student
                });
            }
        });
    });