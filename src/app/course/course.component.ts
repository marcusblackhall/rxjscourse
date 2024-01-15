import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  startWith,
  tap,
  map
} from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
    private courseService: CoursesService
  ) {
    const courseId = +route.snapshot.paramMap.get("courseId");
    const course$ = this.courseService.loadCourseById(courseId)
      .pipe(startWith(null));
    const lessons$ = this.courseService.lessonsForCourse(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(
        ([course, lessons]) => {
          return {
            course,
            lessons
          }
        }
      ),
      tap(console.log)
    );

  }




}











