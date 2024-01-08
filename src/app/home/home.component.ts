import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private loadingService:LoadingService,
    private coursesService:CoursesService) {

  }

  ngOnInit() {


   this.reloadCourses();



  }

  reloadCourses(){

    const courses$ =this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo))
    );

    const loadCourses$ =  this.loadingService.showUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(c => c.category == "BEGINNER"))

    );

    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(c => c.category == "ADVANCED"))

    );
  }



}




