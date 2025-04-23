import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisionIcon from "@mui/icons-material/Visibility";
import MissionIcon from "@mui/icons-material/Flag";
import ValuesIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import "../index.css";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: "56.25%", // 16:9 aspect ratio
  position: "relative",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: 30,
    color: "white",
  },
}));

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sections = [
    {
      title: "Our Vision",
      description:
        "To be the leading provider of premium eyewear, setting new standards in style, comfort, and innovation while making quality eyewear accessible to everyone.",
      icon: <VisionIcon />,
      image: "/img/about/vision.jpg",
    },
    {
      title: "Our Mission",
      description:
        "To enhance people's lives through exceptional eyewear solutions, combining cutting-edge technology with timeless design to create products that inspire confidence and comfort.",
      icon: <MissionIcon />,
      image: "/img/about/mission.jpg",
    },
    {
      title: "Our Values",
      description:
        "Quality, innovation, customer satisfaction, and sustainability are at the heart of everything we do. We believe in creating products that make a difference.",
      icon: <ValuesIcon />,
      image: "/img/about/values.jpg",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box component="section" sx={{ py: 6 }}>
        <div className="about-text-block main-story">
          <p>
            What started as a small boutique eyewear shop has grown into a global brand known for
            its commitment to quality and innovation. Our journey began with a simple idea: to create
            eyewear that not only looks great but feels great too. Today, we continue to push
            boundaries in design and technology while maintaining our core values of quality and
            customer satisfaction.
          </p>
        </div>

        <div className="about-text-block history">
          <p>
            Founded in 2020, OPTIC has been at the forefront of eyewear innovation,
            combining cutting-edge technology with timeless design. Our commitment to
            quality and customer satisfaction has made us a trusted name in the industry.
          </p>
        </div>

        <div className="about-text-block collection">
          <p>
            Discover our carefully curated collection of eyewear, featuring the latest trends and
            timeless classics. Each piece is crafted with precision and style in mind.
          </p>
        </div>
      </Box>

      <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4, width: '100%' }}
        >
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary">About Us</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}
        >
          About OPTIC
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: "800px",
            mb: 6,
            textAlign: 'center',
            margin: '0 auto'
          }}
        >
          Founded in 2020, OPTIC has been at the forefront of eyewear innovation,
          combining cutting-edge technology with timeless design. Our commitment to
          quality and customer satisfaction has made us a trusted name in the
          industry.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {sections.map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <StyledCard>
              <StyledCardMedia
                image={section.image}
                title={section.title}
              />
              <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                <IconWrapper sx={{ margin: '0 auto' }}>{section.icon}</IconWrapper>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}
                >
                  {section.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {section.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}
        >
          Our Story
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: "800px",
            textAlign: 'center',
            margin: '0 auto'
          }}
        >
          What started as a small boutique eyewear shop has grown into a global
          brand known for its commitment to quality and innovation. Our journey
          began with a simple idea: to create eyewear that not only looks great
          but feels great too. Today, we continue to push boundaries in design
          and technology while maintaining our core values of quality and
          customer satisfaction.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
