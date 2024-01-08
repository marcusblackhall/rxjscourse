import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { CourseService } from '../courses/course.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(private coursesService:CourseService) {

  }

  ngOnInit() {
      const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo))
      )
      ;

   this.reloadCourses();



  }

  reloadCourses(){
    let courseService$ =this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo))
    );

    this.beginnerCourses$ = courseService$.pipe(
      map(courses => courses.filter(c => c.category == "BEGINNER"))

    );

    this.advancedCourses$ = courseService$.pipe(
      map(courses => courses.filter(c => c.category == "ADVANCED"))

    );
  }



}




